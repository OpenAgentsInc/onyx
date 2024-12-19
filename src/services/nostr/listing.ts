import { Filter } from "nostr-tools"
import { NostrEvent } from "./ident"
import { Nip28Channel } from "./nip28channel"
import { PrivateMessageManager } from "./private"

interface ArcadeEvent {
  content?: string;
  id?: string;
  pubkey?: string;
  created_at?: number; // epoch create time
  tags?: string[];
  geohash?: string;
  public?: boolean;
}

interface ArcadeListingInput {
  type: 'l1';
  action: 'buy' | 'sell';
  item: string;
  content?: string;
  price: number;
  currency?: string;
  amt: number;
  min_amt?: number;
  payments: string[];
  expiration: string;
  geohash?: string;
}

interface ArcadeListing extends ArcadeEvent {
  type: 'l1';
  action: 'buy' | 'sell';
  item: string; // bitcoin, or anything else
  price: number; //
  currency: string; // espected currency for trade
  amt: number; // max amount for sale
  min_amt?: number; // min amount will accept (if not present... same as max)
  payments: string[]; // list of payment methods
  expiration: number; // expiraton seconds
}

interface ArcadeOfferInput {
  type: 'o1';
  listing_id: string; // source listing id
  listing_pubkey?: string; // source listing pubkey
  content?: string; // nice message with any details
  price: number; // price offered (if different from listing)
  currency?: string; // currency offered (if different from listing)
  amt: number; // amount offered (should be >= min_amt <= amt)
  payment: string; // payment type selection
  expiration: string; // offer should be ignored after this time
  geohash?: string;
}

interface ArcadeOffer extends ArcadeEvent {
  type: 'o1';
  price: number;
  currency: string;
  amt: number;
  payment: string;
  expiration: number;
}

interface ArcadeActionInput {
  type: 'a1';
  action: 'accept' | 'finalize' | 'comment';
  offer_id: string; // source listing id
  reply_pubkey?: string; // offer public key, to make a private accept
  content?: string; // nice message with any details
}

interface ArcadeAction extends ArcadeEvent {
  type: 'a1';
  action: 'accept' | 'finalize' | 'comment';
}

export class ArcadeListings {
  channel_id: string;
  conn: Nip28Channel;
  private: PrivateMessageManager;
  constructor(conn: Nip28Channel, id: string) {
    this.conn = conn;
    this.private = new PrivateMessageManager(conn.pool);
    this.channel_id = id;
  }

  sub(callback: (ev: NostrEvent) => void, filter: Filter = {}) {
    this.conn.sub(this.channel_id, callback, filter);
  }

  async list(filter: Filter = {}, db_only = false): Promise<ArcadeListing[]> {
    const now_secs = Date.now() / 1000;
    const ents = (
      await this.conn.list(
        this.channel_id,
        { '#x': ['listing'], ...filter },
        db_only
      )
    ).map((el: NostrEvent) => {
      try {
        const tag = el.tags.find((el) => {
          return el[0] == 'data';
        });
        if (!tag) return null
        const info: ArcadeListing = JSON.parse(tag[1]);
        this.augmentListing(info, el);
        if (this.expired(now_secs, info)) return null;
        return info;
      } catch {
        return null;
      }
    });
    return ents.filter((el) => {
      return el != null;
    }) as ArcadeListing[];
  }

  expired(now_secs: number, info: ArcadeListing | ArcadeOffer) {
    const expiry = (info.created_at || 0) + info.expiration;
    return now_secs > expiry;
  }

  async post(listing: ArcadeListingInput): Promise<ArcadeListing> {
    const secs = convertToSeconds(listing.expiration);
    if (!secs) {
      throw new Error(`invalid expiration ${listing.expiration}`);
    }
    // For privacy, we limit the precision of the geohash to 5 digits. A 5-digit geohash represents an area roughly the size of a large airport. Example with DFW: https://geohash.softeng.co/9vfgp
    // An empty geohash string is valid; it means "somewhere on the planet".
    const final: ArcadeListing = {
      type: listing.type,
      action: listing.action,
      amt: listing.amt,
      price: listing.price,
      item: listing.item,
      currency: listing.currency ? listing.currency : '',
      expiration: secs,
      payments: listing.payments,
    };
    const tags = [
      ['x', 'listing'],
      ['data', JSON.stringify(final)],
    ];
    if (listing.geohash) tags.push(['g', listing.geohash.substring(0, 5)]);
    const content = listing.content ?? '';
    delete listing.content;
    const ev = await this.conn.send(this.channel_id, content, undefined, tags);
    this.augmentListing(final, ev);
    return final;
  }

  async postOffer(offer: ArcadeOfferInput): Promise<NostrEvent> {
    const secs = convertToSeconds(offer.expiration);
    if (!secs) {
      throw new Error(`invalid expiration ${offer.expiration}`);
    }
    const final: ArcadeOffer = {
      type: offer.type,
      amt: offer.amt,
      price: offer.price,
      currency: offer.currency ? offer.currency : '',
      expiration: secs,
      payment: offer.payment,
    };
    const tags = [
      ['x', 'offer'],
      ['data', JSON.stringify(final)],
    ];
    if (offer.geohash) tags.push(['g', offer.geohash.substring(0, 5)]);
    const content = offer.content ?? '';
    delete offer.content;
    if (offer.listing_pubkey) {
      return await this.private.send(
        offer.listing_pubkey,
        content,
        offer.listing_id,
        tags
      );
    } else {
      return await this.conn.send(
        this.channel_id,
        content,
        offer.listing_id,
        tags
      );
    }
  }

  async postAction(act: ArcadeActionInput): Promise<NostrEvent> {
    // actions are "accept" and "finalize" and "comment"
    // only 1 accept should be posted
    // only 1 finalize should be posted
    // as many "comment" can be posted
    const final: ArcadeAction = {
      type: act.type,
      action: act.action,
    };
    const tags = [
      ['x', 'action'],
      ['data', JSON.stringify(final)],
    ];
    const content = act.content ?? '';
    delete act.content;
    if (act.reply_pubkey) {
      return await this.private.send(
        act.reply_pubkey,
        content,
        act.offer_id,
        tags
      );
    } else {
      return await this.conn.send(this.channel_id, content, act.offer_id, tags);
    }
  }

  subOffers(callback: (ev: NostrEvent) => void, filter: Filter = {}) {
    // notify on any offer for this whole channel
    this.conn.sub(this.channel_id, callback, { '#x': ['offer'], ...filter });
    this.private.sub(callback, { '#x': ['offer'], ...filter });
  }

  async listOffers(
    listing_id: string,
    filter: Filter = {},
    db_only = false
  ): Promise<ArcadeOffer[]> {
    const now_secs = Date.now() / 1000;
    const pubs = await this.conn.list(
      this.channel_id,
      { '#x': ['offer'], ...filter },
      db_only
    );
    const privs = await this.private.list(
      { '#x': ['offer'], ...filter },
      db_only
    );
    const ents = pubs.concat(privs).map((el: NostrEvent) => {
      const tag = el.tags.find((el) => {
        return el[0] == 'data';
      });
      const repl = el.tags.find((el) => {
        return el[0] == 'e' && el[1] == listing_id;
      });
      if (!tag || !repl) {
        return null;
      }
      try {
        const info: ArcadeOffer = JSON.parse(tag[1]);
        this.augmentListing(info, el);
        if (this.expired(now_secs, info)) return null;
        return info;
      } catch {
        return null;
      }
    });
    return ents.filter((el) => {
      return el != null;
    }) as ArcadeOffer[];
  }

  subActions(callback: (ev: NostrEvent) => void, filter: Filter = {}) {
    // notify on any offer for this whole channel
    this.conn.sub(this.channel_id, callback, { '#x': ['action'], ...filter });
    this.private.sub(callback, { '#x': ['action'], ...filter });
  }

  async listActions(
    offer_id: string,
    filter: Filter = {},
    db_only = false
  ): Promise<ArcadeAction[]> {
    const pubs = await this.conn.list(
      this.channel_id,
      { '#x': ['action'], ...filter },
      db_only
    );
    const privs = await this.private.list(
      { '#x': ['action'], ...filter },
      db_only
    );
    const ents = pubs.concat(privs).map((el: NostrEvent) => {
      const tag = el.tags.find((el) => {
        return el[0] == 'data';
      });
      const repl = el.tags.find((el) => {
        return el[0] == 'e' && el[1] == offer_id;
      });
      if (!tag || !repl) {
        return null;
      }
      const info: ArcadeAction = JSON.parse(tag[1]);
      this.augmentListing(info, el);
      return info;
    });
    return ents.filter((el) => {
      return el != null;
    }) as ArcadeAction[];
  }

  private augmentListing(info: ArcadeEvent, el: NostrEvent) {
    info.id = el.id;
    info.content = el.content;
    info.created_at = el.created_at;
    info.pubkey = el.pubkey;
    const geo = el.tags.find((el) => {
      return el[0] == 'g';
    });
    if (geo) info.geohash = geo[1];
    info.public = el.kind != 4;
  }
}

export function convertToSeconds(input: string): number | undefined {
  const durationRegex =
    /(\d+)\s*(s(?:econds?)?|m(?:in(?:utes?)?)?|h(?:ours?)?|d(?:ays?)?|w(?:eeks?)?|mon(?:ths?)?)/gi;
  const matches = input.match(durationRegex);

  if (!matches) {
    return undefined; // Invalid input format
  }

  let totalSeconds = 0;

  for (const match of matches) {
    const unitRegex =
      /(\d+)\s*(s(?:econds?)?|m(?:in(?:utes?)?)?|h(?:ours?)?|d(?:ays?)?|w(?:eeks?)?|mon(?:ths?)?)/i;
    const unitMatches = match.match(unitRegex);

    if (unitMatches) {
      const quantity = parseInt(unitMatches[1]);
      const unit = unitMatches[2].toLowerCase();

      switch (unit) {
        case 's':
        case 'seconds':
          totalSeconds += quantity;
          break;
        case 'm':
        case 'min':
        case 'minutes':
          totalSeconds += quantity * 60;
          break;
        case 'h':
        case 'hour':
        case 'hours':
          totalSeconds += quantity * 60 * 60;
          break;
        case 'd':
        case 'day':
        case 'days':
          totalSeconds += quantity * 24 * 60 * 60;
          break;
        case 'w':
        case 'week':
        case 'weeks':
          totalSeconds += quantity * 7 * 24 * 60 * 60;
          break;
        case 'mon':
        case 'month':
        case 'months':
          totalSeconds += quantity * 30 * 24 * 60 * 60; // Assuming 30 days per month
          break;
        default:
          return undefined; // Invalid unit
      }
    }
  }

  return totalSeconds;
}

export function formatDuration(duration: number): string {
  if (duration < 0) {
    throw new Error('Duration must be a non-negative number.');
  }

  const units: [string, number][] = [
    ['d', 24 * 60 * 60],
    ['h', 60 * 60],
    ['m', 60],
    ['s', 1],
  ];

  const parts: string[] = [];

  for (const [unit, seconds] of units) {
    const value = Math.floor(duration / seconds);
    if (value > 0) {
      parts.push(`${value}${unit}`);
      duration -= value * seconds;
    }
  }

  if (parts.length === 0) {
    return '0s';
  }

  return parts.join(' ');
}
