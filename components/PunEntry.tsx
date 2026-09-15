"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Pun } from "@/lib/types";
import { SITE_URL } from "@/lib/text";
import { VoteButton } from "./VoteButton";

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function PunEntry({
  pun,
  voted,
  canVote,
  rank,
  highlight,
  as = "h2",
}: {
  pun: Pun;
  voted: boolean;
  canVote: boolean;
  rank?: number;
  highlight?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <article id={pun.slug} className="py-10 sm:py-12">
      {(rank === 1 || pun.community) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {rank === 1 && <span className="tag bg-[var(--clay)] text-[var(--cream)]">Top of the pot</span>}
          {pun.community && <span className="tag text-[var(--moss)] shadow-[inset_0_0_0_1px_var(--line)]">Community</span>}
        </div>
      )}
      <Heading className="display text-[clamp(2.2rem,5.4vw,3.4rem)] text-[var(--forest)]">
        <Link href={`/pun/${pun.slug}`}>
          <span className="entry-word">{mark(pun.word, highlight)}</span>
        </Link>
      </Heading>
      <p className="mt-3 text-[0.95rem] text-[var(--moss)]">
        <span className="italic">[ {pun.sayIt} ]</span>
        <span className="mx-2 opacity-40">·</span>
        <span>
          a play on <span className="font-semibold text-[var(--ink)]">{pun.wordplay}</span>
        </span>
      </p>
      <blockquote className="quote mt-6 text-[clamp(1.15rem,2.4vw,1.4rem)] font-medium leading-snug tracking-[-0.015em] text-[var(--ink)] text-pretty">
        {pun.sentence}
      </blockquote>
      <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-[var(--forest)] text-pretty">{pun.definition}</p>
      <footer className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--moss)]">
          by <span className="font-semibold text-[var(--forest)]">{pun.author}</span>
          {pun.community && <span> · {date.format(pun.createdAt)}</span>}
        </p>
        <div className="flex items-center gap-2">
          <CopyLink slug={pun.slug} word={pun.word} />
          <VoteButton slug={pun.slug} word={pun.word} votes={pun.votes} voted={voted} enabled={canVote} />
        </div>
      </footer>
    </article>
  );
}

function mark(text: string, q?: string): ReactNode {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[color-mix(in_oklab,var(--ochre)_28%,transparent)] text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function CopyLink({ slug, word }: { slug: string; word: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${SITE_URL}/pun/${slug}`;
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${word} · Teapository`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* share sheet dismissed */
    }
  };
  return (
    <button type="button" onClick={copy} className="btn btn-ghost swap inline-grid! place-items-center px-4 py-2 text-sm" aria-live="polite">
      <span className="col-start-1 row-start-1" data-hidden={copied}>
        Share
      </span>
      <span className="col-start-1 row-start-1 text-[var(--clay)]" data-hidden={!copied}>
        Copied
      </span>
    </button>
  );
}
