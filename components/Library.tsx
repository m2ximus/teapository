"use client";

import { Fragment, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Banner as BannerData } from "@/data/banners";
import type { Pun } from "@/lib/types";
import { ALPHABET, fold, letterOf } from "@/lib/text";
import { Banner } from "./Banner";
import { Floaters } from "./Floaters";
import { Ink } from "./Ink";
import { PunEntry } from "./PunEntry";

type Sort = "top" | "fresh" | "az";
const SORTS: { id: Sort; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "fresh", label: "Fresh" },
  { id: "az", label: "A–Z" },
];

const PAGE = 20;

export function Library({ puns, voted, canVote, banners }: { puns: Pun[]; voted: string[]; canVote: boolean; banners: BannerData[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("top");
  const [limit, setLimit] = useState(PAGE);
  const [typing, setTyping] = useState(false);
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const votedSet = useMemo(() => new Set(voted), [voted]);

  // Restore ?q= and ?letter= so filtered views can be shared.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const q = p.get("q");
    const l = p.get("letter")?.toUpperCase();
    const s = p.get("sort") as Sort | null;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from the URL */
    if (q) setQuery(q);
    if (l && ALPHABET.includes(l)) setLetter(l);
    if (s && SORTS.some((x) => x.id === s)) setSort(s);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (deferred) p.set("q", deferred);
    if (letter) p.set("letter", letter);
    if (sort !== "top") p.set("sort", sort);
    const next = p.size ? `?${p}` : location.pathname;
    history.replaceState(null, "", next);
  }, [deferred, letter, sort]);

  // "/" jumps to search, like every good library.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(t.tagName) && !t.isContentEditable && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyping(false), 600);
    return () => clearTimeout(id);
  }, [typing, query]);

  const letters = useMemo(() => new Set(puns.map((p) => letterOf(p.word))), [puns]);

  const results = useMemo(() => {
    const q = fold(deferred.trim()).replace(/[-\s]+/g, "");
    const scored = puns
      .filter((p) => !letter || letterOf(p.word) === letter)
      .map((p) => {
        if (!q) return { p, score: 0 };
        const word = fold(p.word).replace(/[-\s]+/g, "");
        const play = fold(p.wordplay).replace(/[-\s]+/g, "");
        const rest = fold(`${p.sentence} ${p.definition} ${p.author}`).replace(/[-\s]+/g, "");
        const score = word.startsWith(q) ? 4 : word.includes(q) ? 3 : play.includes(q) ? 2 : rest.includes(q) ? 1 : -1;
        return { p, score };
      })
      .filter((x) => x.score >= 0);
    const order: Record<Sort, (a: Pun, b: Pun) => number> = {
      top: (a, b) => b.votes - a.votes || a.word.localeCompare(b.word),
      fresh: (a, b) => b.createdAt - a.createdAt,
      az: (a, b) => fold(a.word).localeCompare(fold(b.word)),
    };
    return scored.sort((a, b) => b.score - a.score || order[sort](a.p, b.p)).map((x) => x.p);
  }, [puns, deferred, letter, sort]);

  const topSlug = useMemo(() => puns.reduce<Pun | null>((best, p) => (p.votes > (best?.votes ?? 0) ? p : best), null)?.slug, [puns]);

  const choose = (fn: () => void) => {
    fn();
    setLimit(PAGE);
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) listRef.current?.scrollIntoView({ block: "start" });
  };

  const rawQuery = deferred.trim();
  const [lead, rest] = [banners[0], banners.slice(1)];

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-10 pt-6 sm:px-8 sm:pt-4">
        <Floaters />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="cat-hero">
            <Ink name="cat" width="clamp(104px, 15vw, 150px)" color="var(--ink)" label="Até Chá cat" />
          </div>
          <h1 className="display mt-6 text-[clamp(3rem,8vw,5.5rem)]">Teapository</h1>
          <p className="mt-4 max-w-md text-lg text-[var(--moss)] text-pretty">
            A community dictionary of tea puns. {puns.length} so far. Search them, upvote your favourites, or add your own.
          </p>

          <div className="search mt-8 w-full max-w-xl" data-typing={typing}>
            <label htmlFor="search" className="sr-only">
              Search puns
            </label>
            <svg className="steam pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--clay)]" width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
              <path d="M8 9c-2-2 2-3 0-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13 9c-2-2 2-3 0-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M3 12h15v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3Z" stroke="var(--forest)" strokeWidth="1.6" strokeLinejoin="round" style={{ strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 }} />
            </svg>
            <input
              id="search"
              ref={inputRef}
              type="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTyping(true);
                setLimit(PAGE);
              }}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Search guiltea, curiosity, chai…"
              className="w-full bg-transparent py-4 pl-14 pr-24 text-lg"
            />
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {query ? (
                <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="pop btn btn-ghost px-3 py-1 text-sm" aria-label="Clear search">
                  Clear
                </button>
              ) : (
                <kbd className="kbd mr-2 hidden sm:inline-block">/</kbd>
              )}
            </span>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-y border-[var(--line)] bg-[color-mix(in_oklab,var(--cream)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-3 py-2 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Segmented
            label="Browse by letter"
            className="no-scrollbar overflow-x-auto"
            value={letter ?? "all"}
            options={[{ id: "all", label: "All" }, ...ALPHABET.map((l) => ({ id: l, label: l, disabled: !letters.has(l) }))]}
            onChange={(id) => choose(() => setLetter(id === "all" ? null : id))}
            size="sm"
          />
          <Segmented label="Sort" value={sort} options={SORTS} onChange={(id) => choose(() => setSort(id as Sort))} className="self-start lg:self-auto" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 xl:grid-cols-[220px_minmax(0,720px)_220px] xl:justify-center">
        <aside className="hidden xl:block" aria-label="Sponsored">
          {lead && (
            <div className="sticky top-24 mt-10">
              <Banner banner={lead} variant="rail" />
            </div>
          )}
        </aside>

        <div ref={listRef} className="mx-auto w-full max-w-[720px] scroll-mt-20">
          <p className="mt-8 text-sm text-[var(--moss)]" aria-live="polite">
            {results.length === puns.length && !letter
              ? `All ${puns.length} puns`
              : `${results.length} ${results.length === 1 ? "pun" : "puns"}${letter ? ` under ${letter}` : ""}${rawQuery ? ` for “${rawQuery}”` : ""}`}
          </p>

          {results.length === 0 ? (
            <Empty query={rawQuery} onReset={() => choose(() => { setQuery(""); setLetter(null); })} />
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {results.slice(0, limit).map((p, i) => (
                <Fragment key={p.slug}>
                  <div className={i < 8 ? "rise" : undefined} style={i < 8 ? { animationDelay: `${i * 45}ms` } : undefined}>
                    <PunEntry pun={p} voted={votedSet.has(p.slug)} canVote={canVote} rank={p.slug === topSlug ? 1 : undefined} highlight={rawQuery} />
                  </div>
                  {(i === 4 || i === 14) && banners.length > 0 && (
                    <div className="py-8 xl:hidden">
                      <Banner banner={banners[i === 4 ? 0 : banners.length - 1]} variant="inline" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}

          {results.length > limit && (
            <div className="flex justify-center pt-4">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn btn-ghost px-6 py-3">
                Pour {Math.min(PAGE, results.length - limit)} more
              </button>
            </div>
          )}
        </div>

        <aside className="hidden xl:block" aria-label="Sponsored">
          {rest[0] && (
            <div className="sticky top-24 mt-10">
              <Banner banner={rest[0]} variant="rail" />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function Empty({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="rise flex flex-col items-center py-20 text-center">
      <Ink name="cat-sly" width="96px" color="var(--forest)" />
      <p className="display mt-6 text-3xl">Nothing steeping here yet</p>
      <p className="mt-3 max-w-sm text-[var(--moss)] text-pretty">
        {query ? <>No pun for “{query}”. Maybe it’s yours to invent?</> : "No puns under this letter. Maybe it’s yours to invent?"}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onReset} className="btn btn-ghost px-5 py-2.5 text-sm">
          Show all puns
        </button>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("teapository:add", { detail: { word: query } }))} className="btn btn-solid px-5 py-2.5 text-sm">
          Add {query ? `“${query}”` : "one"}
        </button>
      </div>
    </div>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
  className = "",
  size = "md",
}: {
  label: string;
  value: string;
  options: { id: string; label: string; disabled?: boolean }[];
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Reveal the filled copy over the active button by animating its clip-path (no layout work).
  useLayoutEffect(() => {
    const el = wrap.current?.querySelector<HTMLButtonElement>(`[data-id="${CSS.escape(value)}"]`);
    const f = fill.current;
    if (!el || !f) return;
    if (first.current) f.style.transition = "none";
    const right = f.offsetWidth - el.offsetLeft - el.offsetWidth;
    f.style.clipPath = `inset(0 ${right}px 0 ${el.offsetLeft}px round 999px)`;
    if (first.current) {
      void f.offsetWidth;
      f.style.transition = "";
      first.current = false;
    }
    if (wrap.current && wrap.current.scrollWidth > wrap.current.clientWidth) {
      el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [value]);

  const cls = `shrink-0 rounded-full font-semibold ${size === "sm" ? "min-w-8 px-2.5 py-1.5 text-[0.8rem]" : "px-4 py-1.5 text-sm"}`;

  return (
    <div ref={wrap} role="group" aria-label={label} className={`seg flex ${className}`}>
      {options.map((o) => (
        <button key={o.id} type="button" data-id={o.id} aria-pressed={o.id === value} disabled={o.disabled} onClick={() => onChange(o.id)} className={cls}>
          {o.label}
        </button>
      ))}
      <div ref={fill} className="seg-fill flex w-max" aria-hidden>
        {options.map((o) => (
          <span key={o.id} className={cls}>
            {o.label}
          </span>
        ))}
      </div>
    </div>
  );
}
