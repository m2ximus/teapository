import "server-only";
import { Redis } from "@upstash/redis";
import { SEED_PUNS } from "@/data/puns";
import type { Pun, PunInput } from "./types";
import { slugify } from "./text";

/*
 * Storage layout (Upstash Redis):
 *   votes                 zset   slug -> upvote count (seed and community puns)
 *   pun:<slug>            json   a community pun
 *   puns:live             zset   slug -> createdAt, approved community puns
 *   puns:pending          zset   slug -> createdAt, awaiting moderation
 *   voter:<id>            set    slugs this anonymous voter has upvoted
 *   rl:<bucket>:<key>     int    fixed-window rate limit counters
 *
 * Without KV env vars (e.g. a fresh fork running locally) the site still works, read-only, with the seed puns.
 */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const redis = url && token ? new Redis({ url, token }) : null;

export const moderated = process.env.MODERATION !== "off";

const SEED_TIME = Date.UTC(2026, 8, 15);
const seeds: Omit<Pun, "votes">[] = SEED_PUNS.map((p, i) => ({
  ...p,
  author: p.author ?? "Anonymous",
  slug: slugify(p.word),
  createdAt: SEED_TIME - i * 60_000,
  community: false,
}));
const seedSlugs = new Set(seeds.map((s) => s.slug));

type Stored = Omit<Pun, "votes">;

export async function listPuns(): Promise<Pun[]> {
  if (!redis) return seeds.map((s) => ({ ...s, votes: 0 }));
  const [scores, live] = await Promise.all([
    redis.zrange<(string | number)[]>("votes", 0, -1, { withScores: true }),
    redis.zrange<string[]>("puns:live", 0, -1),
  ]);
  const votes = new Map<string, number>();
  for (let i = 0; i < scores.length; i += 2) votes.set(String(scores[i]), Number(scores[i + 1]));
  const community = live.length ? (await redis.mget<(Stored | null)[]>(...live.map((s) => `pun:${s}`))).filter((p) => p !== null) : [];
  return [...seeds, ...community].map((p) => ({ ...p, votes: votes.get(p.slug) ?? 0 }));
}

export async function getPun(slug: string): Promise<Pun | null> {
  const seed = seeds.find((s) => s.slug === slug);
  if (!redis) return seed ? { ...seed, votes: 0 } : null;
  const [stored, score, isLive] = await Promise.all([
    seed ? null : redis.get<Stored>(`pun:${slug}`),
    redis.zscore("votes", slug),
    seed ? 1 : redis.zscore("puns:live", slug),
  ]);
  const pun = seed ?? stored;
  if (!pun || isLive === null) return null;
  return { ...pun, votes: Number(score ?? 0) };
}

export async function votedBy(voter: string | undefined): Promise<string[]> {
  if (!redis || !voter) return [];
  return redis.smembers(`voter:${voter}`);
}

/** Toggles an upvote. Returns the new count and whether the voter now has it upvoted. */
export async function toggleVote(slug: string, voter: string) {
  if (!redis) throw new Error("Storage is not configured");
  const exists = seedSlugs.has(slug) || (await redis.zscore("puns:live", slug)) !== null;
  if (!exists) return null;
  const added = await redis.sadd(`voter:${voter}`, slug);
  if (added) {
    return { votes: await redis.zincrby("votes", 1, slug), voted: true };
  }
  await redis.srem(`voter:${voter}`, slug);
  const votes = await redis.zincrby("votes", -1, slug);
  return { votes: Math.max(0, votes), voted: false };
}

export async function slugTaken(slug: string) {
  if (seedSlugs.has(slug)) return true;
  if (!redis) return false;
  return (await redis.exists(`pun:${slug}`)) === 1;
}

export async function addPun(input: PunInput) {
  if (!redis) throw new Error("Storage is not configured");
  const slug = slugify(input.word);
  const pun: Stored = { ...input, slug, createdAt: Date.now(), community: true };
  const created = await redis.set(`pun:${slug}`, pun, { nx: true });
  if (!created) return null;
  await redis.zadd(moderated ? "puns:pending" : "puns:live", { score: pun.createdAt, member: slug });
  return { slug, live: !moderated };
}

export async function listPending(): Promise<Stored[]> {
  if (!redis) return [];
  const slugs = await redis.zrange<string[]>("puns:pending", 0, -1);
  if (!slugs.length) return [];
  return (await redis.mget<(Stored | null)[]>(...slugs.map((s) => `pun:${s}`))).filter((p) => p !== null);
}

export async function approve(slug: string) {
  if (!redis) return;
  const createdAt = await redis.zscore("puns:pending", slug);
  if (createdAt === null) return;
  await redis.zadd("puns:live", { score: Number(createdAt), member: slug });
  await redis.zrem("puns:pending", slug);
}

export async function remove(slug: string) {
  if (!redis || seedSlugs.has(slug)) return;
  await Promise.all([redis.zrem("puns:pending", slug), redis.zrem("puns:live", slug), redis.zrem("votes", slug), redis.del(`pun:${slug}`)]);
}

/** Fixed-window limiter. Returns true when the call is allowed. */
export async function allow(bucket: string, key: string, max: number, windowSeconds: number) {
  if (!redis) return true;
  const k = `rl:${bucket}:${key}`;
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, windowSeconds);
  return n <= max;
}
