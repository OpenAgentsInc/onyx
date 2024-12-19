/* eslint-disable @typescript-eslint/no-unused-vars */

import { Filter, generatePrivateKey, getPublicKey } from "nostr-tools"
import { NostrEvent, NostrIdentity, NostrPool, UnsignedEvent } from "./"
import { Nip28ChannelInfo } from "./nip28channel"

export interface EncChannelInfo extends Nip28ChannelInfo {
  id: string;
  privkey: string;
  db_only?: boolean;
}

interface InviteArgs extends EncChannelInfo {
  members: string[];
}

export class EncChannel {
  public pool: NostrPool;
  private _knownChannels: EncChannelInfo[] = [];
  //  private store: SqliteStore;

  constructor(pool: NostrPool) {
    this.pool = pool;
  }

  addEventCallback(callback: (event: NostrEvent) => void): void {
    // should get called by the local store
    throw new Error('not implemented');
  }

  async listChannels(db_only?: boolean): Promise<EncChannelInfo[]> {
    console.log('listing enc channels');
    const filt = {
      kinds: [99],
      '#p': [this.pool.ident.pubKey],
    };
    const map = await Promise.all(
      (
        await this.pool.list([filt], db_only)
      ).map(async (ev) => {
        try {
          const inner = await this.pool.ident.nipXXDecrypt(ev);
          if (inner.kind == 400) {
            const chinfo: EncChannelInfo = JSON.parse(inner.content);
            chinfo.id = getPublicKey(chinfo.privkey);
            return chinfo;
          }
        } catch (e) {
          console.log('failed decrypt, probably spam');
        }
        return null;
      })
    );

    const fin = map.filter((ent) => ent != null) as EncChannelInfo[];
    return fin;
  }

  async knownChannels(force?: boolean): Promise<EncChannelInfo[]> {
    if (!this._knownChannels || force) {
      this._knownChannels = await this.listChannels();
    }
    return this._knownChannels;
  }

  async getChannelByName(
    name: string,
    db_only = false
  ): Promise<EncChannelInfo | null> {
    return (await this.listChannels(db_only)).filter(
      (ev) => ev.name == name
    )[0];
  }

  async getChannelById(
    channel_pubkey: string,
    db_only = false
  ): Promise<EncChannelInfo | null> {
    return (await this.listChannels(db_only)).filter(
      (ch) => ch.id == channel_pubkey
    )[0];
  }

  async createPrivate(
    meta: Nip28ChannelInfo,
    member_pubkeys: string[]
  ): Promise<EncChannelInfo> {
    const epriv = generatePrivateKey();
    const epub = getPublicKey(epriv);
    const set = new Set(member_pubkeys);
    set.add(this.pool.ident.pubKey);
    const xmeta: EncChannelInfo = {
      privkey: epriv,
      ...meta,
      id: epub,
      author: this.pool.ident.pubKey,
    };
    await Promise.all(
      Array.from(set).map(async (pubkey) => {
        const inner = {
          kind: 400,
          content: JSON.stringify(xmeta),
          tags: [],
        };
        await this.sendWrapped(pubkey, inner)
      })
    );

    this._knownChannels.push({
      ...meta,
      id: epub,
      author: this.pool.ident.pubKey,
      privkey: epriv,
    });
    return xmeta;
  }

  async invite(args: InviteArgs): Promise<void> {
    const xmeta: Omit<InviteArgs, 'members'> & { members?: string[] } = {
      ...args,
    };
    delete xmeta.members;
    await Promise.all(
      Array.from(args.members).map(async (pubkey) => {
        const inner = {
          kind: 400,
          content: JSON.stringify(xmeta),
          tags: [],
        };
        const enc = await this.pool.ident.nipXXEncrypt(pubkey, inner);
        await this.pool.sendRaw(enc);
      })
    );
  }

  async setMeta(channel_pubkey: string, meta: Nip28ChannelInfo) {
    const epriv = generatePrivateKey();
    const tmp_ident = new NostrIdentity(epriv);
    const message = {
      kind: 403,
      content: await this.pool.ident.nip04XEncrypt(
        epriv,
        channel_pubkey,
        JSON.stringify(meta)
      ),
      tags: [['p', channel_pubkey]],
    };
    const ev = await tmp_ident.signEvent(message);
    return await this.pool.sendRaw(ev);
  }

  async getMeta(info: { id: string, privkey: string, db_only?: boolean }): Promise<Nip28ChannelInfo> {
    const lst = await this.pool.list(
      [{ kinds: [403], '#p': [info.id as string] }],
      info.db_only
    );
    const map = await Promise.all(
      lst.map(async (ev) => {
        return await this.decrypt(info, ev, false);
      })
    );
    const filt = map.filter((ev) => ev != null);
    const red = filt.reduce((prev, curr) => {
      return (curr ? curr.created_at : 0) > (prev ? prev.created_at : 0) ? curr : prev;
    }, filt[0] || null)
    if (red)
      return JSON.parse(red.content);
    const chan = await this.getChannelById(info.id, info.db_only)
    if (chan != null)
      return { about: chan.about, name: chan.name, picture: chan.picture };
    throw Error("no channel")
  }

  async send(
    channel_pubkey: string,
    content: string,
    replyTo?: string,
    tags: string[][] = []
  ): Promise<NostrEvent> {
    if (!channel_pubkey) throw new Error('channel id is required');
    const oth: string[][] = [];

    if (replyTo) {
      oth.push(['e', replyTo, this.pool.relays[0], 'reply']);
    }
    const epriv = generatePrivateKey();
    const tmp_ident = new NostrIdentity(epriv);
    // skipping kind here, cuz it makes indexing suck
    const inner = { content: content, tags: tags, pubkey: this.pool.ident.pubKey };
    const message = {
      kind: 402,
      content: await this.pool.ident.nip04XEncrypt(
        epriv,
        channel_pubkey,
        JSON.stringify(inner)
      ),
      tags: [['p', channel_pubkey]],
    };
    const ev = await tmp_ident.signEvent(message);
    return await this.pool.sendRaw(ev);
  }

  async sendWrapped(
    pubkey: string,
    inner: UnsignedEvent,
  ): Promise<NostrEvent> {
    const enc = await this.pool.ident.nipXXEncrypt(pubkey, inner);
    return await this.pool.sendRaw(enc);
  }

  sub(
    channel: { id: string, privkey: string },
    callback: (ev: NostrEvent) => void,
    filter: Filter = {}
  ) {
    if (!channel.id) throw new Error('channel id is required');
    return this.pool.sub(
      [{ kinds: [402], '#p': [channel.id], ...filter }],
      async (ev) => {
        const dec = await this.decrypt(channel, ev);
        if (dec) callback(dec);
      }
    );
  }

  async decrypt(
    channel: { id: string, privkey: string },
    evx: NostrEvent,
    unwrap = true
  ): Promise<NostrEvent | null> {
    const ident = new NostrIdentity(channel.privkey);
    const ev = { ...evx }
    try {
      const dec = await ident.nip04XDecrypt(
        channel.privkey,
        ev.pubkey,
        ev.content
      );
      if (dec) {
        if (unwrap) {
          const js = JSON.parse(dec);
          if (js.pubkey)
            ev.pubkey = js.pubkey;
          ev.content = js.content;
          ev.tags = js.tags;
        } else {
          ev.content = dec;
        }
        return ev;
      } else {
        return null;
      }
    } catch (e) {
      console.log('decrypt fail', e);
      return null;
    }
  }

  async list(
    channel: { id: string, privkey: string },
    filter: Filter = {},
    db_only = false,
    callback?: (ev: NostrEvent) => Promise<void>,
    cbkey?: any
  ): Promise<NostrEvent[]> {
    if (!channel.id) throw new Error('channel id is required');

    const lst = await this.pool.list(
      [{ kinds: [402], '#p': [channel.id], ...filter }],
      db_only,
      callback && (async (ev) => {
        const dec = await this.decrypt(channel, ev)
        if (dec)
          callback(ev)
      }),
      cbkey || callback
    );

    const map = await Promise.all(
      lst.map(async (ev) => {
        return await this.decrypt(channel, ev);
      })
    );

    return map.filter((ev) => ev != null) as NostrEvent[];
  }

  async muteUser(params: { content: string; pubkey: string }): Promise<void> {
    throw new Error('not implemented yet');
  }
}

export default EncChannel;
