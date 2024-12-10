import type { ArcadeDb } from './db';
import { LRUCache } from "lru-cache"
import {
  Filter, Pub, Relay, SimplePool, Sub, SubscriptionOptions
} from "nostr-tools"
import { NostrEvent, NostrIdentity, UnsignedEvent } from "./ident"

interface SubInfo {
  sub: Sub;
  eose_seen: boolean;
  cbs: Set<(event: NostrEvent) => void>;
  last_hit: number;
}

export class ReconnPool extends SimplePool {
  keepClosed: Set<string>
  reconnectTimeout: number;
  timer: any;

  constructor(opts: { eoseSubTimeout?: number; getTimeout?: number, reconnectTimeout?: number } = {}) {
    super(opts)
    this.keepClosed = new Set()
    this.reconnectTimeout = opts.reconnectTimeout || 5000
  }

  async ensureRelay(url: string): Promise<Relay> {
    this.keepClosed.delete(url)
    const r: Relay = await super.ensureRelay(url)
    r.on('disconnect', () => {
      console.error("lost connection", url)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (!this.keepClosed.has(url)) {
          console.error("reconnect", url)
          this.ensureRelay(url)
        }
      }, this.reconnectTimeout)
    })
    return r
  }

  async close(relays: string[]) {
    clearTimeout(this.timer)
    relays.forEach(val => this.keepClosed.add(val))
    super.close(relays)
  }
}

// very thin wrapper using SimplePool + NostrIdentity
export class NostrPool {
  ident: NostrIdentity;

  relays: string[] = [];
  unsupportedRelays: string[] = [];

  private eventCallbacks: ((event: NostrEvent) => void | Promise<void>)[] = [];
  private pool;
  private unsubMap: Map<undefined | ((ev: NostrEvent) => void | Promise<void>), (ev: NostrEvent) => void | Promise<void>>;
  private lruSub: LRUCache<string, SubInfo>
  watch: Sub;
  db: ArcadeDb | undefined;
  filters: Map<string, SubInfo>;
  subopts: SubscriptionOptions;

  constructor(ident: NostrIdentity, db?: ArcadeDb, subopts: SubscriptionOptions = {}) {
    this.ident = ident;
    const pool = new ReconnPool();
    this.pool = pool;
    this.subopts = subopts;
    this.unsubMap = new Map<(ev: NostrEvent) => void, (ev: NostrEvent) => void>();
    this.lruSub = new LRUCache({ max: 3, dispose: (dat: SubInfo, filter: string) => { dat.sub.unsub() } })
    this.db = db;
    this.filters = new Map<string, SubInfo>();
  }

  async getRelay(uri: string): Promise<Relay> {
    return await this.pool.ensureRelay(uri)
  }

  async get(filters: Filter<number>[],
    db_only = false
  ): Promise<NostrEvent | undefined> {
    const lst = await this.list(filters, db_only)
    const max = lst.reduce((best, cur) => { return (cur.created_at > best.created_at) ? cur : best }, lst[0])
    return max
  }

  async list(filters: Filter<number>[],
    db_only = false,
    callback?: (ev: NostrEvent) => Promise<void>,
    cbkey?: any,
  ): Promise<NostrEvent[]> {
    if (this.db) {
      const since = await this.db.latest(filters);
      let cb: (ev: NostrEvent) => Promise<any>

      if (callback) {
        cb = async (ev) => {
          if (callback) {
            await Promise.all([callback(ev), this.db?.saveEvent(ev)])
          }
        }
        cbkey = cbkey ?? callback
        this.unsubMap.set(cbkey, cb)
      } else {
        cb = async (ev) => this.db?.saveEvent(ev)
      }

      if (db_only) {
        this.sub(
          filters,
          cb,
          undefined,
          since,
        );
      } else {
        // subscribe if needed, wait for eose
        // save to db && return from db
        await new Promise<void>((res, rej) => {
          try {
            this.sub(
              filters,
              cb,
              async () => {
                res();
              },
              since,
            );
          } catch (e) {
            rej(e);
          }
        });
      }
      return await this.db.list(filters);
    } else {
      // subscribe to save events
      return await this.pool.list(this.relays, filters);
    }
  }

  async setRelays(relays: string[]): Promise<void> {
    this.pool.keepClosed = new Set(this.relays)
    this.relays = relays;
    await Promise.all(
      relays.map((url) => {
        this.pool.ensureRelay(url);
      })
    );
  }

  close() {
    this.pool.close(this.relays);
  }

  async setAndCheckRelays(relays: string[], nips: number[]): Promise<void> {
    const responses = relays.map((url) => {
      const nip11url = url.replace('wss:', 'https:').replace('ws:', 'http:');
      const ret: [string, Promise<Response>] = [
        url,
        fetch(nip11url, {
          headers: { Accept: 'application/nostr+json' },
        }),
      ];
      return ret;
    });

    const urls: string[] = [];
    const unsup: string[] = [];

    for (const [url, resp] of responses) {
      try {
        const info = await (await resp).json();
        if (nips.every((nip) => info.supported_nips?.includes(nip))) {
          urls.push(url);
        } else {
          unsup.push(url);
        }
      } catch (e) {
        console.log(`${e}: can't connect to ${url}`);
        unsup.push(url);
      }
    }

    this.relays = urls;
    this.unsupportedRelays = unsup;
    await Promise.all(
      relays.map((url) => {
        return this.pool.ensureRelay(url);
      })
    );
  }

  /**
   * Starts a subscription with a filter and optional options, and adds event callbacks to
   * the subscription.
   * @param {Filter} filter - tags, etc
   * @param {SubscriptionOptions} [opts] - SubscriptionOptions
   */

  start(filter: Filter[], opts?: SubscriptionOptions): void {
    // todo webworker support: https://github.com/adamritter/nostr-relaypool-ts
    this.watch = this.pool.sub(this.relays, filter, opts);
    this.eventCallbacks.map((cb) => this.watch.on('event', cb));
  }

  getTotalSubs() {
    return this.lruSub.size
  }

  hasSub(filter: Filter) {
    return this.lruSub.has(JSON.stringify(filter))
  }

  unsub(callback: (event: NostrEvent) => void) {
    for (const [fil, ent] of this.filters.entries()) {
      const lruEnt = this.lruSub.peek(JSON.stringify(fil))
      if (lruEnt) {
        lruEnt.sub.unsub()
      }
      if (ent.cbs.has(callback)) {
        ent.sub.unsub()
      }
      ent.cbs.delete(callback);
      const cbm = this.unsubMap.get(callback);
      if (cbm) {
        ent.cbs.delete(cbm);
        this.unsubMap.delete(callback);
      }
      if (!ent.cbs) {
        this.filters.delete(fil);
        ent.sub.unsub()
      }
    }
  }

  sub(
    filters: Filter<number>[],
    callback: (event: NostrEvent) => void,
    eose?: () => Promise<void>,
    since?: number,
    closeOnEose?: boolean
  ): void {
    // subcribe to filters
    // maintain filter-subscription map
    // get callbacks on new events
    // optionally get callbacks on eose
    const new_filters: Filter[] = [];
    const old_filters: SubInfo[] = [];

    filters.forEach((f) => {
      const has = this.filters.get(JSON.stringify(f));
      if (has) old_filters.push(has);
      else new_filters.push(f);
    });

    const now = Date.now();

    if (new_filters.length) {
      let sub_filters = new_filters;
      if (since) {
        // caller has stuff in the db for this filter, so just ask for more recent
        sub_filters = sub_filters.map((f) => {
          return { ...f, since };
        });
      }

      new_filters.forEach((f, i: number) => {
        const fil = JSON.stringify(f)
        const isFetchMeta = (f.kinds?.includes(0) || f.kinds?.includes(3)) ?? false

        // sub has found, do nothing for this case. Use .get to update recency
        if (this.lruSub.get(fil)) return

        // open sub for this filter
        const sub: Sub = this.pool.sub(this.relays, [sub_filters[i]], this.subopts);
        const cbs = new Set<(event: NostrEvent) => void>();
        cbs.add(callback);

        const dat = { sub: sub, eose_seen: false, cbs, last_hit: now };
        this.filters.set(fil, dat);

        // sub for user's metadata will be auto closed, no need to add to lru
        if (!isFetchMeta) {
          this.lruSub.set(fil, dat);
        }

        sub.on('event', (ev) => {
          dat.cbs.forEach((sub) => {
            sub(ev);
          });
        });

        sub.on('eose', () => {
          dat.eose_seen = true;
          if (eose) eose();
          if (closeOnEose || isFetchMeta) sub.unsub();
        });
      });
    }

    old_filters.forEach((dat) => {
      if (dat) {
        dat.cbs.add(callback);
        dat.last_hit = now;
        if (eose) {
          if (dat.eose_seen) eose();
          else dat.sub.on('eose', eose);
        }
      }
    });
  }

  stop() {
    if (this.watch) {
      this.watch.unsub();
    }
  }

  seenOn(id: string): string[] {
    return this.pool.seenOn(id);
  }

  /**
   * Publishes an event and returns the event along with a subscription object to watch
   * @param {UnsignedEvent} message - The `message` parameter is an `UnsignedEvent` object, which
   * represents an event that has not yet been signed by the identity of the publisher
   * @returns An array containing an `Event` object and a subscription object to watch for publication.
   */
  async publish(message: UnsignedEvent) {
    const event: NostrEvent = await this.ident.signEvent(message);
    return [event, this.pool.publish(this.relays, event)] as [NostrEvent, Pub];
  }

  async publishRaw(event: NostrEvent) {
    return [event, this.pool.publish(this.relays, event)] as [NostrEvent, Pub];
  }

  /**
   * This is an asynchronous function that sends an unsigned event and waits for it to be published,
   * returning the event once it has been successfully sent to at least 1 relay.
   * @param {UnsignedEvent} message - The message parameter is of type UnsignedEvent
   */
  async send(message: UnsignedEvent): Promise<NostrEvent> {
    const [event, pubs] = await this.publish(message);
    return new Promise<NostrEvent>((res, rej) => {
      setTimeout(() => { rej("send timed out") }, 3000)
      pubs.on('ok', () => {
        res(event);
      });
      pubs.on('failed', (relay: string) => {
        console.log("failed to publish", relay)
      });
    });
  }

  async sendRaw(message: NostrEvent): Promise<NostrEvent> {
    const [event, pubs] = await this.publishRaw(message);
    return new Promise<NostrEvent>((res, rej) => {
      setTimeout(() => { rej("send raw timed out") }, 3000)
      pubs.on('ok', () => {
        res(event);
      });
      pubs.on('failed', (relay: string) => {
        console.log("failed to publish raw", relay)
      });
    });
  }


  /**
   * This function adds a callback function to an array of event callbacks.
   * @param callback - Callback that takes an event of type NostrEvent as its parameter
   */
  addEventCallback(callback: (event: NostrEvent) => void): void {
    this.eventCallbacks.push(callback);
  }
}
