/* eslint-disable @typescript-eslint/no-unused-vars */

import { nip05, nip19 } from "nostr-tools"
import { NostrPool } from "./"

export class Contact {
  pubkey: string;
  secret: boolean;
  legacy: boolean;
}

type PrivList = Array<[string, Record<string, string | number | null | boolean>]>;


export class ContactManager {
  private pool: NostrPool;
  public contacts: Map<string, Contact>
  lastRead: number;
  hasRead = false;

  //  private store: SqliteStore;

  constructor(pool: NostrPool) {
    this.pool = pool
    this.contacts = new Map()
  }

  async add(contact: Contact): Promise<void> {
    const has = this.contacts.get(contact.pubkey)
    if (has && has.secret == contact.secret && has.legacy == contact.legacy)
      return

    await this.maybeRead()
    this.contacts.set(contact.pubkey, contact)
    await this.write()
  }

  async has(pubkey: string) {
    return this.contacts.get(pubkey)
  }

  async get(pubkey: string) {
    await this.maybeRead()
    return this.contacts.get(pubkey)
  }

  async remove(pubkey: string) {
    const has = this.contacts.get(pubkey)
    if (!has)
      return

    this.contacts.delete(pubkey)
    await this.write()
  }

  async write() {
    const secretContacts = Array.from(this.contacts.values()).filter(e => e.secret || e.legacy).map(e => [e.pubkey, { legacy: e.legacy, secret: e.secret }])
    const publicContacts = Array.from(this.contacts.values()).filter(e => !e.secret).map(e => ["p", e.pubkey])
    const encr = await this.pool.ident.selfEncrypt(JSON.stringify(secretContacts))
    await Promise.all(
      [this.pool.send({
        content: "",
        tags: publicContacts,
        kind: 3,
      }),
      this.pool.send({
        content: encr,
        tags: [],
        kind: 10003,
      })])
  }

  async maybeRead() {
    if (!this.hasRead) {
      await this.read()
      this.hasRead = true
    }
  }

  async list(): Promise<Contact[]> {
    await this.maybeRead()
    return Array.from(this.contacts.values())
  }

  curList(): Contact[] {
    return Array.from(this.contacts.values())
  }

  async read(): Promise<void> {
    this.contacts = await this.readContacts()
  }

  async readContacts(): Promise<Map<string, Contact>> {
    const pubR = await this.pool.get([{
      authors: [this.pool.ident.pubKey],
      kinds: [3],
      limit: 1,
    }])

    const privR = await this.pool.get([{
      authors: [this.pool.ident.pubKey],
      kinds: [20003, 10003],
      limit: 1,
    }])

    const contacts: Map<string, Contact> = new Map()

    if (pubR && pubR.tags) {
      pubR.tags.filter(tag => tag[0] == "p").forEach(tag => {
        contacts.set(tag[1], { pubkey: tag[1], secret: false, legacy: false })
      })
    }

    if (privR && privR.content) {
      try {
        const decr = await this.pool.ident.selfDecrypt(privR.content)
        const privC: PrivList = JSON.parse(await this.pool.ident.selfDecrypt(privR.content))
        privC.forEach(ent => {
          contacts.set(ent[0], { pubkey: ent[0], secret: ent[1].secret as boolean, legacy: ent[1].legacy as boolean })
        })
      } catch (e) {
        console.log("can't load private contacts", e)
      }
    }

    return contacts
  }
}



const hexRegEx = /^[0-9A-Fa-f]{64}$/;
const suffixes = ['@arcade.chat', '@damus.io', '@iris.to', '@nostrplebs.com', '@nip05.social'];

export async function resolvePubkey(input: string): Promise<string> {
  if (input.startsWith('npub')) {
    return nip19.decode(input).data.toString()
  } else if (hexRegEx.test(input)) {
    return input;
  } else if (input.startsWith('@')) {
    if (input.includes('.')) {
      try {
        const profile = await nip05.queryProfile("_" + input);
        return profile!.pubkey;
      } catch {
        // ok to fail here
      }
    }

    for (const suffix of suffixes) {
      try {
        const profile = await nip05.queryProfile(input.slice(1) + suffix);
        return profile!.pubkey;
      } catch {
        // ok to fail here
      }
    }
  } else if (input.includes('@')) {
    const profile = await nip05.queryProfile(input);
    return profile!.pubkey;
  }
  console.log("can't resolve" + input)
  throw Error("can't resolve" + input)
}
