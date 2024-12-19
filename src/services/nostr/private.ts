/* eslint-disable @typescript-eslint/no-unused-vars */

import { LRUCache } from "lru-cache"
import { Filter, matchFilter, nip04 } from "nostr-tools"
import { NostrEvent, NostrPool } from "./"

export type BlindedEvent = NostrEvent & { blinded: boolean }
const decryptCache = new LRUCache<string, BlindedEvent>({ max: 1000 })

export class PrivateMessageManager {
  private pool: NostrPool;
  //  private store: SqliteStore;

  constructor(pool: NostrPool) {
    this.pool = pool;
  }

  async send(
    pubkey: string,
    content: string,
    replyTo?: string,
    tags: string[][] = []
  ): Promise<NostrEvent> {
    const oth: string[][] = [];
    if (replyTo) {
      oth.push(['e', replyTo, this.pool.relays[0], 'reply']);
    }
    const ev = await this.pool.send({
      kind: 4,
      content: await this.pool.ident.nip04Encrypt(pubkey, content),
      tags: [['p', pubkey], ...oth, ...tags],
    });
    return ev;
  }

  async send44X(
    pubkey: string,
    content: string,
    replyTo?: string,
    tags: string[][] = []
  ): Promise<NostrEvent> {
    if (replyTo) {
      tags.push(['e', replyTo, this.pool.relays[0], 'reply']);
    }
    const ev = await this.pool.ident.nip44XEncrypt(pubkey, content, tags);
    return await this.pool.sendRaw(ev);
  }

  sub(
    callback: (ev: NostrEvent) => void,
    filter?: Filter,
    eose?: () => Promise<void>,
    pubkey?: string
  ) {
    const filter_ex: Filter<number>[] = this.filter(pubkey ? [pubkey] : []);
    console.log('subbing', filter_ex);
    this.pool.sub(
      filter_ex,
      (ev) => {
        if (!filter || matchFilter(filter, ev)) {
          this.decrypt(ev, pubkey ? [pubkey] : []).then((got) => {
            if (got) callback(got);
          });
        }
      },
      async () => { await new Promise((res) => setTimeout(res, 1)); if (eose) await eose(); }
    );
  }

  async decrypt(evx: NostrEvent, pubkeys: string[]): Promise<BlindedEvent | null> {
    if (decryptCache.has(evx.id)) {
      return decryptCache.get(evx.id) || null
    }
    let ev = { ...evx, blinded: false }
    try {
      if (ev.pubkey != this.pool.ident.pubKey) {
        if (ev.kind == 99) {
          ev = { ...await this.pool.ident.nipXXDecrypt(ev), blinded: false };
        } else {
          if (ev.content.endsWith("??1")) {
            if (!pubkeys.length) {
              console.log("can't decrypt if we don't know the channel")
              throw Error("can't decrypt without channel pubkey")
            } else {
              const { content, pubkey: author } = await this.pool.ident.nip44XDecryptAny(
                pubkeys,
                ev
              );
              ev.content = content
              ev.pubkey = author
              ev.blinded = true
            }
          } else {
            ev.content = await this.pool.ident.nip04Decrypt(
              ev.pubkey,
              ev.content
            );
          }
        }
      } else {
        const pubkey = ev.tags.find((t) => t[0] == 'p')?.[1] as string;
        ev.content = await nip04.decrypt(
          this.pool.ident.privKey,
          pubkey,
          ev.content
        );
      }
      decryptCache.set(ev.id, ev)
      return ev.content ? ev : null;
    } catch (e) {
      // can't decrypt, probably spam or whatever
      console.log("can't decrypt from", evx.pubkey)
      return null;
    }
  }

  async list(
    filter?: Filter,
    db_only = false,
    pubkey_or_keys: string | string[] = [],
    callback?: (ev: NostrEvent) => Promise<void>,
    cbkey?: any
  ): Promise<BlindedEvent[]> {
    let pubkeys: string[]
    if (!Array.isArray(pubkey_or_keys)) {
      pubkeys = [pubkey_or_keys]
    } else {
      pubkeys = pubkey_or_keys
    }
    const filter_ex: Filter<number>[] = this.filter(pubkeys);
    let cb = callback
    if (callback) {
      cb = async (ev: NostrEvent) => { const evx = await this.decrypt(ev, pubkeys); if (evx) { await callback(evx) } }
    }
    const lst = await this.pool.list(filter_ex, db_only, cb, cbkey || callback);
    const mapped = await Promise.all(
      lst.map(async (ev: NostrEvent) => {
        return (!filter || matchFilter(filter, ev)) ? await this.decrypt(ev, pubkeys) : null;
      })
    );

    return mapped.filter((ev: BlindedEvent | null) => {
      return ev;
    }) as BlindedEvent[]
  }

  public filter(pubkeys: string[]) {
    const filter_ex: Filter<number>[] = [
      { kinds: [4], '#p': [this.pool.ident.pubKey] },
    ];
    if (pubkeys.length) {
      filter_ex[0].authors = pubkeys

      filter_ex.push({
        kinds: [4],
        authors: [this.pool.ident.pubKey],
        '#p': pubkeys,
      });

      const tmpkeys = pubkeys.map(pubkey => this.pool.ident.nip44XIdent(pubkey).pubKey)
      filter_ex.push({
        kinds: [4],
        authors: tmpkeys,
      });
    }
    return filter_ex;
  }
}
