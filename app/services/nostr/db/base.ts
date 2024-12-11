import { Filter } from "nostr-tools"
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
        console.log("[DB] Opening database connection...");
        
        this.db = await open({
          name: 'onyx.db',
          location: 'default',
          enableWAL: false,
        });
        
        // Log database path
        const pathResult = await this.db.execute('PRAGMA database_list');
        console.log("[DB] Database location:", JSON.stringify(pathResult?.rows?._array));

        // Log journal mode
        const journalMode = await this.db.execute('PRAGMA journal_mode');
        console.log("[DB] Journal mode:", JSON.stringify(journalMode?.rows?._array));

        // Log synchronous setting
        const syncMode = await this.db.execute('PRAGMA synchronous');
        console.log("[DB] Synchronous mode:", JSON.stringify(syncMode?.rows?._array));
        
        await this.db.execute(`
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

        // Log table info
        const tableInfo = await this.db.execute("PRAGMA table_info('posts')");
        console.log("[DB] Table schema:", JSON.stringify(tableInfo?.rows?._array));

        // Log index info
        const indexList = await this.db.execute("PRAGMA index_list('posts')");
        console.log("[DB] Indexes:", JSON.stringify(indexList?.rows?._array));

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
      await this.db.execute("delete from posts");
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
      // First check total count
      const countResult = await this.db.execute('SELECT COUNT(*) as count FROM posts');
      console.log("[DB] Total records in database:", JSON.stringify(countResult?.rows?._array));

      const result = await this.db.execute(sql, args);
      const records = result?.rows?._array || [];
      console.log(`[DB] Found ${records.length} records in database`);

      // Debug: Print all records
      if (records.length > 0) {
        console.log("[DB] All records:", JSON.stringify(records.map(r => ({id: r.id, kind: r.kind, e1: r.e1}))));
      }

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
      await this.db.transaction(async (tx) => {
        for (const ev of q) {
          const [sql, args] = this.eventSql(ev);
          await tx.execute(sql, args);
        }
      });
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
        // First try a direct insert
        console.log("[DB] Executing insert SQL:", sql);
        console.log("[DB] Insert args:", JSON.stringify(args));
        
        const result = await this.db.execute(sql, args);
        console.log("[DB] Insert result:", JSON.stringify(result));
        
        // Verify the save
        const verifyResult = await this.db.execute(
          'SELECT * FROM posts WHERE id = ?',
          [ev.id]
        );
        const records = verifyResult?.rows?._array || [];
        
        if (records.length === 0) {
          // Check total count
          const countResult = await this.db.execute('SELECT COUNT(*) as count FROM posts');
          console.error("[DB] Save verification failed. Total records:", JSON.stringify(countResult?.rows?._array));
          
          // Check if record exists with different case
          const allRecords = await this.db.execute('SELECT id FROM posts');
          console.error("[DB] All record IDs:", JSON.stringify(allRecords?.rows?._array));
          
          throw new Error('Save verification failed - record not found');
        }

        console.log("[DB] Save verified for event:", ev.id, "Record:", JSON.stringify(records[0]));
        console.log("[DB] Event saved successfully:", ev.id);

      } catch (error) {
        console.error("[DB] Error saving event:", ev.id, error);
        // Log database state
        try {
          const count = await this.db.execute('SELECT COUNT(*) as count FROM posts');
          console.error("[DB] Current database count:", JSON.stringify(count?.rows?._array));
        } catch (e) {
          console.error("[DB] Error checking database state:", e);
        }
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
        await this.db.close();
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