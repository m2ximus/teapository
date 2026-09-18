"use client";

import { useRef, useState } from "react";
import { Cup } from "./icons";

export function VoteButton({ slug, word, votes: initialVotes, voted: initialVoted, enabled }: { slug: string; word: string; votes: number; voted: boolean; enabled: boolean }) {
  const [state, setState] = useState({ votes: initialVotes, voted: initialVoted, prev: initialVotes, dir: "" as "" | "up" | "down", tick: 0 });
  const [burst, setBurst] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  const apply = (votes: number, voted: boolean) =>
    setState((s) => (s.votes === votes ? { ...s, voted } : { votes, voted, prev: s.votes, dir: votes > s.votes ? "up" : "down", tick: s.tick + 1 }));

  const toggle = async () => {
    if (!enabled || pending.current) return;
    pending.current = true;
    setError("");
    const before = state;
    const voted = !state.voted;
    apply(Math.max(0, state.votes + (voted ? 1 : -1)), voted);
    if (voted) {
      setBurst(false);
      requestAnimationFrame(() => setBurst(true));
    }
    try {
      const res = await fetch("/api/vote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't count that vote.");
      apply(data.votes, data.voted);
    } catch (e) {
      apply(before.votes, before.voted);
      setError(e instanceof Error ? e.message : "Couldn't count that vote.");
    } finally {
      pending.current = false;
    }
  };

  return (
    <span className="relative inline-flex flex-col items-end">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={state.voted}
        aria-label={`${state.voted ? "Remove upvote from" : "Upvote"} ${word}, ${state.votes} ${state.votes === 1 ? "vote" : "votes"}`}
        title={enabled ? undefined : "Voting needs storage configured"}
        data-burst={burst}
        onAnimationEnd={() => setBurst(false)}
        className="vote text-sm"
      >
        <span className="vote-steam" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <Cup className="vote-cup" />
        <span key={state.tick} className="count" data-dir={state.dir} aria-hidden>
          {state.dir && <span className="count-out">{state.prev}</span>}
          <span className="count-in">{state.votes}</span>
        </span>
      </button>
      {error && (
        <span role="status" className="pop absolute right-0 top-full z-10 mt-2 w-56 rounded-xl bg-[var(--forest)] px-3 py-2 text-xs text-[var(--cream)]">
          {error}
        </span>
      )}
    </span>
  );
}
