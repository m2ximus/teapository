# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tea people who enjoy wordplay: festival-goers, growers, tea-shop regulars and anyone who has ever said "guiltea" out loud. They come to browse and laugh, upvote a favourite, share a pun with a friend, or add their own. Along the way they meet Até Chá, the tea festival in Lisbon.

## Product Purpose

Teapository is a community dictionary of tea puns, in the style of Urban Dictionary. Each entry has a word, a pronunciation, the word it plays on, a sentence and a definition. The site is a playful front door to the Até Chá festival.

Success means:
- click-throughs to atecha.co (festival interest and tickets);
- community submissions and votes;
- pun pages and their preview images shared on social media and in chats;
- sponsor banner slots that can be offered to other tea events and brands.

## Positioning

It is the tea pun reference, made and kept by a real tea festival community in Lisbon rather than a generic pun list. Até Chá's hand-drawn world and the community's own entries are what a neighbouring site couldn't copy.

## Operating Context

- Visitors arrive from shared pun links, from festival channels, or by searching for tea puns, often on a phone.
- The core loop is: search or browse A–Z → read an entry → upvote or share → add your own.
- Submissions go into a moderation queue that the organisers review at `/admin` ("the tasting table").
- Anyone can also add puns by opening a pull request to `data/puns.ts`.

## Capabilities and Constraints

- **Library:** a searchable library with an A–Z filter and Top / Fresh / A–Z sorting. It shipped with 64 starter puns.
- **Voting:** anonymous upvotes use a voter cookie, with salted IP hashes used only for rate limits.
- **Submissions:** the add form has a live preview and a honeypot field. Moderation is on by default; `MODERATION=off` publishes submissions immediately.
- **Admin:** `/admin` is protected by the `ADMIN_TOKEN` env var.
- **Pages and banners:** every pun has its own page with a generated OG image. Sponsor banner slots are defined in `data/banners.ts`.
- **Stack:** Next.js App Router on Vercel, with Upstash Redis storage. Without storage the site runs read-only, and submissions point people to GitHub.
- **Terminology:** "pour in" means submit a pun; "steeping" means waiting for moderation; "the tasting table" is the admin page.

## Brand Commitments

- **Artwork:** Até Chá's hand-drawn illustrations (cats, cups, octopus, panda, ship, steam) and the Até Chá wordmark are binding brand assets.
- **Licensing:** the code is MIT, but the brand assets are not.
- **No accounts, ever:** voting and submitting stay anonymous, and that is a core promise.
- **Open source:** the code is public at github.com/m2ximus/teapository, and adding puns through GitHub must stay possible.
- **Voice:** warm, dry and pun-literate, with British spelling ("favourites").

## Evidence on Hand

- **Puns:** 64 starter puns in `data/puns.ts`.
- **Artwork:** `public/art/`.
- **Banner photo:** `public/banner-fields.jpg` (Pexels).
- **Festival facts used in banners:** Até Chá Tea Festival, Lisbon, 17–18 Oct; Teacompression, Azores (São Miguel), 19–22 Oct. Re-check these with the organisers each year.
- **Not yet available:** no testimonials, press, traffic or attendance figures exist. Do not invent them.

## Product Principles

1. **The pun is the hero.** Every screen serves reading, laughing, voting or sharing an entry.
2. **Zero friction to join in.** No sign-up, no gates, and a submission is one form away.
3. **The festival invitation is earned.** Até Chá is present and inviting, but never louder than the puns.
4. **Community-owned.** Open code, open data, moderated with a light touch.
5. **Made to be shared.** Every pun has a clean link and a preview image worth posting.
