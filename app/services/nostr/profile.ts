import { NostrPool } from "./"

export type Profile = Record<string, number | string | boolean>

export class ProfileManager {
  public pool: NostrPool;

  constructor(pool: NostrPool) {
    this.pool = pool;
  }

  async save(prof: Profile, private_keys: string[]) {
    const data = { ...prof }
    const private_settings: Profile = {}
    for (const key of private_keys) {
      if (key in data) {
        private_settings[key] = data[key]
        delete data[key]
      }

    }
    const other = await this.pool.ident.selfEncrypt(JSON.stringify(private_settings))

    if (other.length) {
      data["other"] = other
    }

    const event = await this.pool.send({
      content: JSON.stringify(data),
      kind: 0,
      tags: [],
    })
    return event
  }


  async load(): Promise<Profile | null> {
    try {
      const list = await this.pool.list([{ kinds: [0], authors: [this.pool.ident.pubKey] }], true)
      const latest = list.slice(-1)[0]
      if (latest) {
        const content = JSON.parse(latest.content)
        if (content.other) {
          const other = JSON.parse(await this.pool.ident.selfDecrypt(content.other))
          Object.assign(content, other)
          delete content["other"]
        }
        return content
      }
    } catch (e) {
      console.log("error loading profile: ", e)
    }
    return null
  }
}
