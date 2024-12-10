import { open } from "any-sqlite"
import { Database } from "any-sqlite/lib/types"
import { Filter, matchFilter } from "nostr-tools"
import { NostrEvent } from "../ident"
import { ArcadeDb as ArcadeDbInterface } from "./"

export class ArcadeDb implements ArcadeDbInterface {
  queue: Map<string, NostrEvent>
  timer: NodeJS.Timeout | null;
  db: Database;

  constructor() {
    this.queue = new Map()
    this.timer = null
  }

  async open() {
    if (!this.db) {
      this.db = await open("arcade.1")
      await this.db.execute(`create table if not exists posts (id string not null primary key, content string,
            kind integer, pubkey string, sig string, tags string, p1 string, e1 string,
            created_at integer, verified boolean);`)
    }
  }

  async reset() {
    await this.open()
    await this.db.execute("delete from posts")
  }

  async list(filter: Filter[]): Promise<NostrEvent[]> {
    await this.open()

    const [or, args] = this.filterToQuery(filter);
    const limit = filter && filter[0].limit
    const where = or.trim() ? `where ${or}` : "";
    const limitQ = (!limit || isNaN(limit)) ? "" : ` limit ${limit}`;
    const sql = `select * from posts ${where} ${limitQ}`
    const records = await this.db.execute(sql, args);
    const seen = new Set()
    records.forEach((ev: NostrEvent) => {
      try {
        ev.tags = JSON.parse((ev.tags as unknown) as string)
      } catch {
        ev.tags = []
      }
      seen.add(ev.id)
    })
    for (const ev of this.queue.values()) {
      if (!seen.has(ev.id) && filter.some((f) => matchFilter(f, ev))) {
        seen.add(ev.id)
        records.push(ev)
      }
    }
    return records
  }

  async latest(filter: Filter[]): Promise<number> {
    await this.open()
    const [or, args] = this.filterToQuery(filter);
    const records = await this.db.execute(`select max(created_at) as max from posts where ${or}`, args)
    return records.length ? records[0].max : 0
  }

  private filterToQuery(filter: Filter[]): [string, (string | number)[]] {
    const or: string[] = [];
    const args: (string | number)[] = []
    filter.forEach((f) => {
      const ins: [string, (string | number)[]][] = [];
      if (f.authors)
        ins.push(['pubkey', f.authors])
      if (f.ids)
        ins.push(['id', f.ids])
      if (f.kinds)
        ins.push(['kind', f.kinds])
      if (f['#e'])
        ins.push(['e1', f['#e']])
      if (f['#p'])
        ins.push(['p1', f['#p']])
      const and: string[] = ins.map((inop) => {
        const [fd, vals] = inop;
        const ph = Array(vals.length).fill('?').join(', ');
        args.push(...vals);
        return `(${fd} IN (${ph}))`;
      })
      or.push(and.join(' AND '));
    });
    return [or.join(" or "), args]
  }

  async saveEvent(ev: NostrEvent) {
    this.queue.set(ev.id, ev)
    if (!this.timer) {
      this.timer = setTimeout(async () => { await this.flush() }, 500)
    }
  }

  async flush() {
    const t = this.timer
    this.timer = null
    if (t) clearTimeout(t)
    if (!this.queue) return
    await this.open()
    const q = Array.from(this.queue.values())
    this.queue = new Map()
    await this.db.batch(q.map((ev) => {
      return this.eventSql(ev);
    }))
  }

  async saveEventSync(ev: NostrEvent) {
    const [sql, args] = this.eventSql(ev)
    await this.open()
    await this.db.execute(sql, args)
  }

  eventSql(ev: NostrEvent): [string, (string | number | null)[]] {
    let e1: string | null = null;
    let p1: string | null = null;

    ev.tags.forEach((tag) => {
      if (tag[0] == 'e' && !e1) {
        e1 = tag[1];
      }
      if (tag[0] == 'p' && !p1) {
        p1 = tag[1];
      }
    });

    return [`insert into posts (id, pubkey, content, sig, kind, tags, p1, e1, created_at, verified)
             values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             on conflict (id) do nothing`,
      [ev.id, ev.pubkey, ev.content, ev.sig, ev.kind, JSON.stringify(ev.tags), p1, e1, ev.created_at, 0]
    ];
  }
}

export function connectDb(): ArcadeDb {
  const db = new ArcadeDb();
  return db;
}
