import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";

export const VOTER_COOKIE = "tp_voter";

/** A salted hash of the caller's IP, only ever used as a rate-limit key. */
export async function clientKey() {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return createHash("sha256").update(`${process.env.KV_REST_API_TOKEN ?? "teapository"}:${ip}`).digest("hex").slice(0, 24);
}

/** Anonymous voter id kept in a long-lived cookie; no account needed. */
export async function voterId(create = false) {
  const jar = await cookies();
  const existing = jar.get(VOTER_COOKIE)?.value;
  if (existing && /^[a-f0-9-]{36}$/.test(existing)) return existing;
  if (!create) return undefined;
  const id = randomUUID();
  jar.set(VOTER_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 400, path: "/" });
  return id;
}
