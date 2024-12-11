import { Filter, matchFilter } from "nostr-tools"
import { NostrEvent } from "../ident"
import { NostrDb as NostrDbInterface } from "./"
import { open } from '@op-engineering/op-sqlite';

// Singleton instance
let dbInstance: NostrDb | null = null;

export class NostrDb implements NostrDbInterface {
  queue: Map<string, NostrEvent>;
  timer: NodeJS.Timeout | null;
  db: any | null;

  private constructor() {
    this.queue = new Map();
    this.timer = null;
    this.db = null;
  }

  static async getInstance(): Promise<NostrDb> {
    if (!dbInstance) {
      dbInstance = new NostrDb();
      await dbInstance.open();
    }
    return dbInstance;
  }

  async open() {
    if (!this.db) {
      try {
        console.log("Opening database connection...");
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
        console.log("Database opened and schema created successfully");
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

    console.log("Listing events with filter:", filter);

    const [or, args] = this.filterToQuery(filter);
    const limit = filter && filter[0].limit;
    const where = or.trim() ? `where ${or}` : "";
    const limitQ = (!limit || isNaN(limit)) ? "" : ` limit ${limit}`;
    const sql = `select * from posts ${where} ${limitQ}`;
    
    console.log("Executing SQL:", sql, "with args:", args);
    
    const result = await this.db.execute(sql, args);
    const records = result?.rows?._array || [];
    console.log(`Found ${records.length} records in database`);

    const seen = new Set();

    const processedRecords = records.map((ev: NostrEvent) => {
      try {
        return {
          ...ev,
          tags: typeof ev.tags === 'string' ? JSON.parse(ev.tags) : ev.tags
        };
      } catch (error) {
        console.error("Error parsing tags for event:", ev.id, error);
        return {
          ...ev,
          tags: []
        };
      }
    });

    processedRecords.forEach(ev => seen.add(ev.id));

    // Add queued events that match the filter
    const queuedEvents = Array.from(this.queue.values());
    console.log(`Checking ${queuedEvents.length} queued events against filter`);
    
    for (const ev of queuedEvents) {
      if (!seen.has(ev.id) && filter.some((f) => matchFilter(f, ev))) {
        seen.add(ev.id);
        processedRecords.push(ev);
      }
    }

    console.log(`Returning ${processedRecords.length} total events`);
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
    if (!filter || filter.length === 0) {
      return ["1=1", []];
    }

    const or: string[] = [];
    const args: (string | number)[] = [];
    
    filter.forEach((f) => {
      const ins: [string, (string | number)[]][] = [];
      if (f.authors?.length) ins.push(["pubkey", f.authors]);
      if (f.ids?.length) ins.push(["id", f.ids]);
      if (f.kinds?.length) ins.push(["kind", f.kinds]);
      if (f["#e"]?.length) ins.push(["e1", f["#e"]]);
      if (f["#p"]?.length) ins.push(["p1", f["#p"]]);

      if (ins.length === 0) {
        or.push("1=1"); // Default true condition if no filters
      } else {
        const and: string[] = ins.map((inop) => {
          const [fd, vals] = inop;
          const ph = Array(vals.length).fill("?").join(", ");
          args.push(...vals);
          return `(${fd} IN (${ph}))`;
        });
        or.push(and.join(" AND "));
      }
    });

    return [or.join(" OR "), args];
  }

  async saveEvent(ev: NostrEvent) {
    console.log("Queueing event for save:", ev.id);
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
    console.log(`Flushing ${q.length} events to database`);
    this.queue = new Map();
    
    try {
      // Start a transaction for batch insert
      await this.db.transaction(async (tx) => {
        for (const ev of q) {
          const [sql, args] = this.eventSql(ev);
          await tx.execute(sql, args);
        }
      });
      console.log(`Successfully flushed ${q.length} events to database`);
    } catch (error) {
      console.error("Error flushing events to database:", error);
      // Put events back in queue if save failed
      q.forEach(ev => this.queue.set(ev.id, ev));
      throw error;
    }
  }

  async saveEventSync(ev: NostrEvent) {
    console.log("Saving event synchronously:", ev.id);
    const [sql, args] = this.eventSql(ev);
    await this.open();
    if (this.db) {
      try {
        await this.db.execute(sql, args);
        console.log("Event saved successfully:", ev.id);
      } catch (error) {
        console.error("Error saving event:", ev.id, error);
        throw error;
      }
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
       on conflict (id) do update set
       content = excluded.content,
       kind = excluded.kind,
       pubkey = excluded.pubkey,
       sig = excluded.sig,
       tags = excluded.tags,
       p1 = excluded.p1,
       e1 = excluded.e1,
       created_at = excluded.created_at,
       verified = excluded.verified`,
      [ev.id, ev.pubkey, ev.content, ev.sig, ev.kind, JSON.stringify(ev.tags), p1, e1, ev.created_at, 0],
    ];
  }
}

export async function connectDb(): Promise<NostrDb> {
  return NostrDb.getInstance();
}