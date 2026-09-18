import type { Metadata } from "next";
import Link from "next/link";
import { Ink } from "@/components/Ink";
import { listPending, moderated, redis } from "@/lib/store";
import { isAdmin, moderate, signIn, signOut } from "./actions";

export const metadata: Metadata = { title: "Moderation · Teapository", robots: { index: false } };

export default async function Admin() {
  const admin = await isAdmin();
  const pending = admin ? await listPending() : [];

  return (
    <main className="mx-auto max-w-[760px] px-5 py-12 sm:px-8">
      <Link href="/" aria-label="Back to Teapository">
        <Ink name="atecha-word" width="54px" color="var(--forest)" />
      </Link>
      <h1 className="display mt-10 text-[clamp(2rem,5vw,3rem)]">The tasting table</h1>

      {!process.env.ADMIN_TOKEN ? (
        <p className="mt-4 text-[var(--moss)]">Set an ADMIN_TOKEN environment variable to enable moderation.</p>
      ) : !admin ? (
        <form action={signIn} className="mt-6 flex max-w-sm flex-col gap-3">
          <label htmlFor="token" className="text-sm font-semibold">
            Admin token
          </label>
          <input id="token" name="token" type="password" autoComplete="current-password" className="field" required />
          <button className="btn btn-solid self-start px-5 py-3">Sign in</button>
        </form>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[var(--moss)]">
            <span>
              {pending.length} waiting{!moderated && " · moderation is off, new puns go live immediately"}
              {!redis && " · storage not configured"}
            </span>
            <form action={signOut}>
              <button className="text-sm underline underline-offset-4 hover:text-[var(--clay)]">Sign out</button>
            </form>
          </div>

          {pending.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center text-[var(--moss)]">
              <Ink name="cat-curl" width="120px" color="var(--forest)" />
              <p className="mt-4">Nothing steeping. All caught up.</p>
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-[var(--line)]">
              {pending.map((p) => (
                <li key={p.slug} className="py-8">
                  <p className="display text-3xl">{p.word}</p>
                  <p className="text-sm text-[var(--moss)]">
                    [ {p.sayIt} ] · a play on <b className="text-[var(--ink)]">{p.wordplay}</b>
                  </p>
                  <blockquote className="quote mt-3 font-medium">{p.sentence}</blockquote>
                  <p className="mt-3">{p.definition}</p>
                  <p className="mt-3 text-sm text-[var(--moss)]">
                    by {p.author} · {new Date(p.createdAt).toLocaleString("en-GB")}
                  </p>
                  <form action={moderate} className="mt-4 flex gap-2">
                    <input type="hidden" name="slug" value={p.slug} />
                    <button name="decision" value="approve" className="btn btn-solid px-5 py-2.5 text-sm">
                      Approve
                    </button>
                    <button name="decision" value="reject" className="btn btn-ghost px-5 py-2.5 text-sm">
                      Reject
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
