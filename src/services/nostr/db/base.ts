import { Filter } from "nostr-tools"
import { NostrEvent } from "../ident"
import { NostrDb as NostrDbInterface } from "./"
import * as SQLite from 'expo-sqlite';

// Singleton instance
let dbInstance: NostrDb | null = null;

export class NostrDb implements NostrDbInterface {
  queue: Map<string, NostrEvent>;
  timer: NodeJS.Timeout | null;
  db: SQLite.SQLiteDatabase | null;

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
        console.log("[DB] Opening database connection...");
        
        this.db = SQLite.openDatabaseSync('onyx.db');

        // Set pragmas for better performance
        await this.db.execAsync('PRAGMA journal_mode = DELETE');
        await this.db.execAsync('PRAGMA synchronous = NORMAL');
        
        await this.db.execAsync(`
          create table if not exists posts (
            id text not null primary key,
            content text,
            kind integer not null,
            pubkey text not null,
            sig text,
            tags text,
            p1 text,
            e1 text,
            created_at integer not null,
            verified integer default 0
          );
          
          create index if not exists idx_posts_kind on posts(kind);
          create index if not exists idx_posts_e1 on posts(e1);
          create index if not exists idx_posts_p1 on posts(p1);
          create index if not exists idx_posts_created_at on posts(created_at);
        `);

        console.log("[DB] Database schema initialized");
      } catch (error) {
        console.error('[DB] Failed to open database:', error);
        throw error;
      }
    }
  }

  async reset() {
    await this.open();
    if (this.db) {
      await this.db.execAsync("delete from posts");
    }
  }

  async list(filter: Filter[]): Promise<NostrEvent[]> {
    await this.open();
    if (!this.db) throw new Error("Database not initialized");

    console.log("[DB] Listing events with filter:", JSON.stringify(filter));

    const [or, args] = this.filterToQuery(filter);
    const limit = filter && filter[0].limit;
    const where = or.trim() ? `where ${or}` : "";
    const limitQ = (!limit || isNaN(limit)) ? "" : ` limit ${limit}`;
    const sql = `select * from posts ${where} order by created_at desc ${limitQ}`;
    
    console.log("[DB] Executing SQL:", sql, "with args:", args);
    
    try {
      const result = await this.db.getAllAsync(sql, args);
      console.log("[DB] Raw result:", result);
      
      if (!result?.length) {
        console.log("[DB] No rows found");
        return [];
      }

      const records = result;
      console.log(`[DB] Found ${records.length} records in database`);

      const processedRecords = records.map((ev: NostrEvent) => {
        try {
          return {
            ...ev,
            tags: typeof ev.tags === 'string' ? JSON.parse(ev.tags) : ev.tags
          };
        } catch (error) {
          console.error("[DB] Error parsing tags for event:", ev.id, error);
          return {
            ...ev,
            tags: []
          };
        }
      });

      return processedRecords;
    } catch (error) {
      console.error("[DB] Error executing query:", error);
      throw error;
    }
  }

  async latest(filter: Filter[]): Promise<number> {
    await this.open();
    if (!this.db) throw new Error("Database not initialized");

    const [or, args] = this.filterToQuery(filter);
    const result = await this.db.getFirstAsync<{max: number}>(
      `select max(created_at) as max from posts where ${or}`,
      args
    );
    return result?.max || 0;
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
    console.log("[DB] Queueing event for save:", ev.id);
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
    console.log(`[DB] Flushing ${q.length} events to database`);
    this.queue = new Map();
    
    try {
      for (const ev of q) {
        const [sql, args] = this.eventSql(ev);
        await this.db.runAsync(sql, args);
      }
      console.log(`[DB] Successfully flushed ${q.length} events to database`);
    } catch (error) {
      console.error("[DB] Error flushing events to database:", error);
      q.forEach(ev => this.queue.set(ev.id, ev));
      throw error;
    }
  }

  async saveEventSync(ev: NostrEvent) {
    console.log("[DB] Saving event synchronously:", ev.id);
    const [sql, args] = this.eventSql(ev);
    await this.open();
    if (this.db) {
      try {
        const result = await this.db.runAsync(sql, args);
        console.log("[DB] Save result:", result);
        console.log("[DB] Event saved successfully:", ev.id);
      } catch (error) {
        console.error("[DB] Error saving event:", ev.id, error);
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

    const tags = JSON.stringify(ev.tags);
    console.log("[DB] Preparing SQL for event:", {
      id: ev.id,
      kind: ev.kind,
      e1,
      p1,
      tagsLength: tags.length,
      pubkey: ev.pubkey,
      created_at: ev.created_at
    });

    return [
      `insert or replace into posts (id, pubkey, content, sig, kind, tags, p1, e1, created_at, verified)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ev.id, ev.pubkey, ev.content, ev.sig, ev.kind, tags, p1, e1, ev.created_at, 0],
    ];
  }

  async close() {
    if (this.db) {
      try {
        await this.db.closeAsync();
        this.db = null;
        console.log("[DB] Database connection closed");
      } catch (error) {
        console.error("[DB] Error closing database:", error);
      }
    }
  }
}

export async function connectDb(): Promise<NostrDb> {
  return NostrDb.getInstance();
}