import { Filter } from "nostr-tools"
import { NostrEvent, NostrPool } from "./"
import { EncChannel } from "./encchannel"
import { listChannels, Nip28Channel, Nip28ChannelInfo } from "./nip28channel"

export interface ChannelInput {
  name: string;
  about: string;
  picture: string;
  is_private: boolean;
}

export interface ChannelInfo extends ChannelInput {
  id: string;
  author: string;
  privkey?: string;
}

export class ChannelManager {
  public pool: NostrPool;
  private _knownChannels: ChannelInfo[] = [];
  enc: EncChannel;
  nip28: Nip28Channel;
  joined: Set<string>
  hasRead: boolean;
  //  private store: SqliteStore;

  constructor(pool: NostrPool) {
    this.pool = pool;
    this.enc = new EncChannel(pool);
    this.nip28 = new Nip28Channel(pool);
    this.joined = new Set<string>;
    this.hasRead = false;
  }

  async create(meta: ChannelInput): Promise<ChannelInfo> {
    let ret: ChannelInfo;

    if (meta.is_private) {
      const res = await this.enc.createPrivate(meta, []);
      ret = {
        ...meta,
        id: res.id,
        author: this.pool.ident.pubKey,
        privkey: res.privkey,
      };
    } else {
      const ev = await this.nip28.create(meta);
      ret = {
        ...meta,
        id: ev.id,
        author: ev.pubkey,
      };
    }
    return ret;
  }

  async setMeta(
    channel_id: string,
    is_private: boolean,
    meta: Nip28ChannelInfo
  ): Promise<void> {
    if (is_private) {
      await this.enc.setMeta(channel_id, meta);
    } else {
      await this.nip28.setMeta(channel_id, meta);
    }
  }

  async getMeta(
    channel_id: string,
    privkey?: string,
    db_only = false
  ): Promise<ChannelInfo> {
    if (privkey) {
      return {
        is_private: true,
        ...(await this.enc.getMeta({
          id: channel_id,
          privkey: privkey,
        })),
      } as ChannelInfo;
    } else {
      return {
        is_private: false,
        ...(await this.nip28.getMeta(channel_id, db_only)),
      } as ChannelInfo;
    }
  }

  async send(args: {
    channel_id: string;
    content: string;
    replyTo?: string;
    tags?: string[][];
    is_private?: boolean;
  }): Promise<NostrEvent> {
    if (args.is_private) {
      return await this.enc.send(
        args.channel_id,
        args.content,
        args.replyTo,
        args.tags
      );
    } else {
      return await this.nip28.send(
        args.channel_id,
        args.content,
        args.replyTo,
        args.tags
      );
    }
  }

  async delete(event_id: string, tags: string[][] = []): Promise<NostrEvent> {
    return await this.nip28.delete(event_id, tags);
  }

  sub(info: {
    channel_id: string;
    callback: (ev: NostrEvent) => void;
    filter?: Filter;
    privkey?: string;
  }) {
    if (info.privkey) {
      return this.enc.sub(
        {
          id: info.channel_id,
          privkey: info.privkey,
        },
        info.callback,
        info.filter
      );
    } else {
      return this.nip28.sub(info.channel_id, info.callback, info.filter);
    }
  }

  async listChannels(db_only?: boolean, limit?: number): Promise<ChannelInfo[]> {
    let ret: ChannelInfo[];
    const enc = await this.enc.listChannels(db_only);
    ret = enc.map((el) => ({
      is_private: true,
      id: el.id,
      name: el.name,
      about: el.about,
      picture: el.picture,
      author: el.author as string,
      privkey: el.privkey
    }));
    const pub = await listChannels(this.pool, db_only);
    ret = ret.concat(
      pub.map((el) => ({ is_private: false, ...el } as ChannelInfo))
    );
    return ret;
  }

  async joinAll(ids: string[]): Promise<void> {
    await this.maybeReadJoined()
    ids.forEach(el => this.joined.add(el))
    await this.writeJoined()
  }

  async join(id: string) {
    await this.maybeReadJoined()
    this.joined.add(id)
    await this.writeJoined()
  }

  async leave(id: string) {
    this.joined.delete(id)
    await this.writeJoined()
  }

  async writeJoined() {
    const joined = [...this.joined]
    const encr = await this.pool.ident.selfEncrypt(JSON.stringify(joined))
    await this.pool.send({
      content: encr,
      tags: [["d", "arcade-channels"]],
      kind: 30040,
    })
  }

  async maybeReadJoined() {
    if (!this.hasRead) {
      await this.readJoined()
      this.hasRead = true
    }
  }

  async listJoined(): Promise<string[]> {
    await this.maybeReadJoined()
    return [...this.joined]
  }

  async readJoined(): Promise<void> {
    console.log("reading")
    const privR = await this.pool.get([{
      authors: [this.pool.ident.pubKey],
      kinds: [30040],
      "#d": ["arcade-channels"],
      limit: 1,
    }])
    console.log("got", privR)

    const joined = new Set<string>()

    if (privR && privR.content) {
      try {
        const decr = await this.pool.ident.selfDecrypt(privR.content)
        console.log("got", decr)
        const list: Array<string> = JSON.parse(decr)
        this.joined = new Set(list)
      } catch (e) {
        console.log("can't load private contacts", e)
      }
    }
  }

  async list(info: {
    channel_id: string;
    filter?: Filter;
    db_only?: boolean;
    privkey?: string;
    callback?: (ev: NostrEvent) => Promise<void>;
    cbkey?: any
  }): Promise<NostrEvent[]> {
    if (info.privkey) {
      return await this.enc.list(
        {
          id: info.channel_id,
          privkey: info.privkey,
        },
        info.filter,
        info.db_only,
        info.callback,
        info.cbkey
      );
    } else {
      return await this.nip28.list(info.channel_id, info.filter, info.db_only, info.callback, info.cbkey);
    }
  }
}
