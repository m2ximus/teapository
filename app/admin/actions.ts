"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { approve, remove } from "@/lib/store";

const COOKIE = "tp_admin";
const digest = (s: string) => createHash("sha256").update(s).digest();

export async function isAdmin() {
  const expected = process.env.ADMIN_TOKEN;
  const given = (await cookies()).get(COOKIE)?.value;
  return !!expected && !!given && timingSafeEqual(digest(expected), digest(given));
}

export async function signIn(form: FormData) {
  const token = String(form.get("token") ?? "");
  const expected = process.env.ADMIN_TOKEN;
  if (expected && timingSafeEqual(digest(expected), digest(token))) {
    (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 60 * 60 * 24 * 30 });
  }
  refresh();
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
  refresh();
}

export async function moderate(form: FormData) {
  if (!(await isAdmin())) return;
  const slug = String(form.get("slug") ?? "");
  if (form.get("decision") === "approve") await approve(slug);
  else await remove(slug);
  refresh();
}
