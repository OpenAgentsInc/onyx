import { Filter } from "nostr-tools"
import { NostrEvent } from "../ident"

declare module '.' {
  export function connectDb(): NostrDb;
  export class NostrDb {
    list(filter: Filter[]): Promise<NostrEvent[]>;
    latest(filter: Filter[]): Promise<number>;
    saveEvent(ev: NostrEvent): Promise<void>;
    saveEventSync(ev: NostrEvent): Promise<void>;
    flush(): Promise<void>;
    reset(): Promise<void>;
  }
}

type DbModule = {
  connectDb: () => NostrDb;
  NostrDb: new () => NostrDb;
}

try {
  const db: DbModule = require('./base')  // eslint-disable-line @typescript-eslint/no-var-requires
  exports.connectDb = db.connectDb
  exports.NostrDb = db.NostrDb
} catch (e) {
  console.log(e)
  exports.connectDb = () => { throw Error("missing peer dep") }
  exports.NostrDb = () => { throw Error("missing peer dep") }
  exports.DbEvent = () => { throw Error("missing peer dep") }
}
