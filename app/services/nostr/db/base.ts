import { Filter, matchFilter } from "nostr-tools"
import { NostrEvent } from "../ident"
import { NostrDb as NostrDbInterface } from "./"
import { open } from '@op-engineering/op-sqlite';

export class NostrDb implements NostrDbInterface {
  queue: Map<string, NostrEvent>;
  timer: NodeJS.Timeout | null;
  db: any | null;

  constructor() {
    this.queue = new Map();
    this.timer = null;
    this.db = null;
  }

  async open() {
    if (!this.db) {
      try {
        this.db = await open({
          name: 'onyx.db',
          location: 'default',
        });
        
        await this.db.execute(`create table if not exists posts (
          id string not null primary key,
          content string,
          kind integer,
          pubkey string,
          sig string,
          tags string,
          p1 string,
          e1 string,
          created_at integer,
          verified boolean
        );`);
      } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
      }
    }
  }

  async reset() {
    await this.open();
    if (this.db) {
      await this.db.execute("delete from posts");
    }
  }

  async list(filter: Filter[]): Promise<NostrEvent[]> {
    await this.open();
    if (!this.db) throw new Error("Database not initialized");

    const [or, args] = this.filterToQuery(filter);
    const limit = filter && filter[0].limit;
    const where = or.trim() ? `where ${or}` : "";
    const limitQ = (!limit || isNaN(limit)) ? "" : ` limit ${limit}`;
    const sql = `select * from posts ${where} ${limitQ}`;
    
    const result = await this.db.execute(sql, args);
    const records = result?.rows?._array || [];
    const seen = new Set();

    const processedRecords = records.map((ev: NostrEvent) => {
      try {
        return {
          ...ev,
          tags: typeof ev.tags === 'string' ? JSON.parse(ev.tags) : ev.tags
        };
      } catch {
        return {
          ...ev,
          tags: []
        };
      }
    });

    processedRecords.forEach(ev => seen.add(ev.id));

    for (const ev of this.queue.values()) {
      if (!seen.has(ev.id) && filter.some((f) => matchFilter(f, ev))) {
        seen.add(ev.id);
        processedRecords.push(ev);
      }
    }
    return processedRecords;
  }

  async latest(filter: Filter[]): Promise<number> {
    await this.open();
    if (!this.db) throw new Error("Database not initialized");

    const [or, args] = this.filterToQuery(filter);
    const result = await this.db.execute(
      `select max(created_at) as max from posts where ${or}`,
      args
    );
    const records = result?.rows?._array || [];
    return records.length ? records[0].max : 0;
  }

  private filterToQuery(filter: Filter[]): [string, (string | number)[]] {
    const or: string[] = [];
    const args: (string | number)[] = [];
    filter.forEach((f) => {
      const ins: [string, (string | number)[]][] = [];
      if (f.authors) ins.push(["pubkey", f.authors]);
      if (f.ids) ins.push(["id", f.ids]);
      if (f.kinds) ins.push(["kind", f.kinds]);
      if (f["#e"]) ins.push(["e1", f["#e"]]);
      if (f["#p"]) ins.push(["p1", f["#p"]]);
      const and: string[] = ins.map((inop) => {
        const [fd, vals] = inop;
        const ph = Array(vals.length).fill("?").join(", ");
        args.push(...vals);
        return `(${fd} IN (${ph}))`;
      });
      or.push(and.join(" AND "));
    });
    return [or.join(" or "), args];
  }

  async saveEvent(ev: NostrEvent) {
    this.queue.set(ev.id, ev);
    if (!this.timer) {
      this.timer = setTimeout(async () => {
        await this.flush();
      }, 500);
    }
  }

  async flush() {
    const t = this.timer;
    this.timer = null;
    if (t) clearTimeout(t);
    if (!this.queue) return;

    await this.open();
    if (!this.db) throw new Error("Database not initialized");

    const q = Array.from(this.queue.values());
    this.queue = new Map();
    
    // Start a transaction for batch insert
    await this.db.transaction(async (tx) => {
      for (const ev of q) {
        const [sql, args] = this.eventSql(ev);
        await tx.execute(sql, args);
      }
    });
  }

  async saveEventSync(ev: NostrEvent) {
    const [sql, args] = this.eventSql(ev);
    await this.open();
    if (this.db) {
      await this.db.execute(sql, args);
    }
  }

  eventSql(ev: NostrEvent): [string, (string | number | null)[]] {
    let e1: string | null = null;
    let p1: string | null = null;

    ev.tags.forEach((tag) => {
      if (tag[0] === "e" && !e1) {
        e1 = tag[1];
      }
      if (tag[0] === "p" && !p1) {
        p1 = tag[1];
      }
    });

    return [
      `insert into posts (id, pubkey, content, sig, kind, tags, p1, e1, created_at, verified)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       on conflict (id) do nothing`,
      [ev.id, ev.pubkey, ev.content, ev.sig, ev.kind, JSON.stringify(ev.tags), p1, e1, ev.created_at, 0],
    ];
  }
}

export function connectDb(): NostrDb {
  const db = new NostrDb();
  return db;
}