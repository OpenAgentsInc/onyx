import { Filter } from "nostr-tools"
import { NostrEvent } from "../ident"

declare module '.' {
  export function connectDb(): ArcadeDb;
  export class ArcadeDb {
    list(filter: Filter[]): Promise<NostrEvent[]>;
    latest(filter: Filter[]): Promise<number>;
    saveEvent(ev: NostrEvent): Promise<void>;
    saveEventSync(ev: NostrEvent): Promise<void>;
    flush(): Promise<void>;
    reset(): Promise<void>;
  }
}

type DbModule = {
  connectDb: () => ArcadeDb;
  ArcadeDb: new () => ArcadeDb;
}

try {
  const db: DbModule = require('./base')  // eslint-disable-line @typescript-eslint/no-var-requires
  exports.connectDb = db.connectDb
  exports.ArcadeDb = db.ArcadeDb
} catch (e) {
  console.log(e)
  exports.connectDb = () => { throw Error("missing peer dep") }
  exports.ArcadeDb = () => { throw Error("missing peer dep") }
  exports.DbEvent = () => { throw Error("missing peer dep") }
}
