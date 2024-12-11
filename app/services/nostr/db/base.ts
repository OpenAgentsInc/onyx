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
        console.log("[DB] Opening database connection...");
        
        // op-sqlite requires a simple name, not a full path
        this.db = await open({
          name: 'onyx.db',
          // Use 'default' location which is the app's document directory
          location: 'default',
          // Enable WAL mode for better concurrent access
          enableWAL: true,
        });
        
        // Create tables
        await this.db.execute(`
          create table if not exists posts (
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
          );
          
          create index if not exists idx_posts_kind on posts(kind);
          create index if not exists idx_posts_e1 on posts(e1);
          create index if not exists idx_posts_p1 on posts(p1);
          create index if not exists idx_posts_created_at on posts(created_at);
        `);

        // Verify table exists
        const tables = await this.db.execute(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='posts'"
        );
        console.log("[DB] Tables:", tables?.rows?._array);

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
      const result = await this.db.execute(sql, args);
      const records = result?.rows?._array || [];
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

      // Debug log some record details
      if (processedRecords.length > 0) {
        console.log("[DB] Sample record:", {
          id: processedRecords[0].id,
          kind: processedRecords[0].kind,
          tags: processedRecords[0].tags
        });
      }

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
      // Start a transaction for batch insert
      await this.db.transaction(async (tx) => {
        for (const ev of q) {
          const [sql, args] = this.eventSql(ev);
          await tx.execute(sql, args);
        }
      });
      console.log(`[DB] Successfully flushed ${q.length} events to database`);
    } catch (error) {
      console.error("[DB] Error flushing events to database:", error);
      // Put events back in queue if save failed
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
        await this.db.execute(sql, args);
        console.log("[DB] Event saved successfully:", ev.id);
        // Verify the save
        const verifyResult = await this.db.execute("SELECT id FROM posts WHERE id = ?", [ev.id]);
        const saved = verifyResult?.rows?._array?.length > 0;
        console.log("[DB] Event save verified:", saved);
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
      tagsLength: tags.length
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