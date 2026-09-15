# Teapository

A community dictionary of tea puns, by [Até Chá](https://atecha.co), Lisbon's tea festival.

**[teapository.vercel.app](https://teapository.vercel.app)**

Each entry is written like a dictionary page:

> **Guiltea** · [ Gill-Tee ] · a play on *Guilty*
> “Late night Yunnan black post 4pm. Guiltea.”
> The warm shame of caffeine after dark.

- **No accounts.** Anyone can add a pun or upvote one. An anonymous cookie stops the same browser voting twice.
- **Search and browse.** Search as you type, jump by letter, and sort by Top, Fresh or A–Z.
- **Open source.** Fork it, add puns, or run your own copy.

## Add a pun

- **On the site:** press **Add your pun**. New puns are checked by a moderator before they go live.
- **On GitHub:** add an entry to [`data/puns.ts`](data/puns.ts) and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Run it locally

```bash
npm install
npm run dev
```

With no storage configured, the site runs read-only with the puns in `data/puns.ts`. Voting and submissions are switched off.

## Deploy your own

1. Import the repo into Vercel.
2. Add an **Upstash Redis** database from the Vercel Marketplace. It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` also work.
3. Set these environment variables:

| Variable | Purpose |
| --- | --- |
| `ADMIN_TOKEN` | Password for `/admin`, where you approve or reject submissions. |
| `MODERATION` | Set to `off` to publish submissions immediately. On by default. |

Spam protection includes a honeypot field, a no-links rule, and per-IP rate limits. IPs are only stored as salted hashes, and they expire.

## Stack

Next.js (App Router), React, Tailwind CSS v4, Upstash Redis. The illustrations belong to Até Chá.

## Licence

Code is MIT. The Até Chá name, logo and illustrations are not covered by the MIT licence. Please swap them out if you run your own copy.
