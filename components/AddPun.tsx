"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LIMITS, REPO_URL } from "@/lib/text";
import { Arrow, Close, Plus } from "./icons";
import { Ink } from "./Ink";

type Field = "word" | "sayIt" | "wordplay" | "sentence" | "definition" | "author";
type Form = Record<Field, string>;
const EMPTY: Form = { word: "", sayIt: "", wordplay: "", sentence: "", definition: "", author: "" };

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string; fields: Field[] } | { kind: "done"; live: boolean; slug: string };

export function AddPun({ canSubmit }: { canSubmit: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [shake, setShake] = useState(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const id = useId();

  const open = (prefill?: Partial<Form>) => {
    if (status.kind === "done") {
      setForm(EMPTY);
      setStatus({ kind: "idle" });
    }
    if (prefill) setForm((f) => ({ ...f, ...Object.fromEntries(Object.entries(prefill).filter(([, v]) => v)) }));
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const onAdd = (e: Event) => open((e as CustomEvent<Partial<Form>>).detail);
    window.addEventListener("teapository:add", onAdd);
    if (new URLSearchParams(location.search).has("add")) dialog.current?.showModal();
    return () => window.removeEventListener("teapository:add", onAdd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (status.kind === "error" && status.fields.includes(k)) setStatus({ ...status, fields: status.fields.filter((x) => x !== k) });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = (["word", "wordplay", "sentence", "definition"] as const).filter((k) => !form[k].trim());
    if (missing.length) {
      setStatus({ kind: "error", message: "A pun needs a word, what it plays on, a sentence and a definition.", fields: missing });
      setShake((s) => s + 1);
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/puns", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot.current?.value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Something went wrong.", fields: data.fields ?? [] });
        setShake((s) => s + 1);
        return;
      }
      setStatus({ kind: "done", live: data.live, slug: data.slug });
      if (data.live) router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the teapot. Check your connection and try again.", fields: [] });
      setShake((s) => s + 1);
    }
  };

  const invalid = (k: Field) => status.kind === "error" && status.fields.includes(k);
  const sending = status.kind === "sending";

  return (
    <>
      <button type="button" onClick={() => open()} className="btn btn-solid btn-plus px-5 py-2.5 text-sm">
        <Plus /> Add your pun
      </button>

      <dialog ref={dialog} className="sheet p-0" aria-labelledby={`${id}-title`} onClick={(e) => e.target === dialog.current && close()}>
        <div className="max-h-[inherit] overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--cream)] px-6 pb-3 pt-5 sm:px-8">
            <span className="mx-auto h-1 w-10 rounded-full bg-[var(--line)] sm:hidden" aria-hidden />
            <button type="button" onClick={close} className="btn btn-ghost absolute right-4 top-4 size-10 text-lg" aria-label="Close">
              <Close />
            </button>
          </div>

          {status.kind === "done" ? (
            <div className="rise flex flex-col items-center px-6 pb-14 pt-4 text-center sm:px-10">
              <div style={{ animation: "breathe 5s ease-in-out infinite" }}>
                <Ink name="cat-smile" width="120px" color="var(--forest)" />
              </div>
              <h2 id={`${id}-title`} className="display mt-6 text-[clamp(1.8rem,4vw,2.6rem)]">
                {status.live ? "Poured in!" : "It’s steeping."}
              </h2>
              <p className="mt-3 max-w-md text-lg text-[var(--moss)] text-pretty">
                {status.live
                  ? `“${form.word}” is now in the Teapository. Go gather some upvotes.`
                  : `Thanks for “${form.word}”. Every pun gets a quick taste test before it’s served, so it’ll appear once it’s approved.`}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {status.live && (
                  <a href={`/pun/${status.slug}`} className="btn btn-solid px-5 py-3">
                    See it <Arrow />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY);
                    setStatus({ kind: "idle" });
                  }}
                  className="btn btn-ghost px-5 py-3"
                >
                  Add another
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 px-6 pb-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-10">
              <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                <div>
                  <h2 id={`${id}-title`} className="display text-[clamp(1.9rem,3.8vw,2.6rem)]">
                    Pour in your pun
                  </h2>
                  <p className="mt-2 text-[var(--moss)]">No account needed. Just a good pun and a straight face.</p>
                </div>

                <TextField id={`${id}-word`} label="The pun" hint="e.g. Guiltea" value={form.word} onChange={set("word")} max={LIMITS.word} invalid={invalid("word")} required autoFocus />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField id={`${id}-play`} label="A play on" hint="e.g. Guilty" value={form.wordplay} onChange={set("wordplay")} max={LIMITS.wordplay} invalid={invalid("wordplay")} required />
                  <TextField id={`${id}-say`} label="Say it like" hint="e.g. Gill-Tee" value={form.sayIt} onChange={set("sayIt")} max={LIMITS.sayIt} invalid={invalid("sayIt")} />
                </div>
                <TextField id={`${id}-sentence`} label="Use it in a sentence" hint="Late night Yunnan black post 4pm. Guiltea." value={form.sentence} onChange={set("sentence")} max={LIMITS.sentence} invalid={invalid("sentence")} required multiline rows={2} />
                <TextField id={`${id}-def`} label="Definition" hint="What does it mean, really?" value={form.definition} onChange={set("definition")} max={LIMITS.definition} invalid={invalid("definition")} required multiline rows={3} />
                <TextField id={`${id}-author`} label="Your name" hint="Anonymous" value={form.author} onChange={set("author")} max={LIMITS.author} invalid={invalid("author")} optional />

                <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                {status.kind === "error" && (
                  <p key={shake} role="alert" className="nudge rounded-xl bg-[color-mix(in_oklab,var(--clay)_12%,transparent)] px-4 py-3 text-sm text-[var(--clay)]">
                    {status.message}
                  </p>
                )}

                {!canSubmit && (
                  <p className="rounded-xl bg-[var(--paper)] px-4 py-3 text-sm text-[var(--moss)]">
                    Submissions aren’t connected on this copy yet. You can still{" "}
                    <a href={REPO_URL} target="_blank" rel="noopener" className="font-semibold underline underline-offset-4">
                      add it on GitHub
                    </a>
                    .
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={sending || !canSubmit} className="btn btn-solid swap inline-grid! place-items-center min-w-44 px-6 py-3.5 disabled:opacity-60">
                    <span className="col-start-1 row-start-1 inline-flex items-center gap-2" data-hidden={sending}>
                      Pour it in <Arrow />
                    </span>
                    <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2" data-hidden={!sending} aria-hidden={!sending}>
                      <span className="inline-block" style={{ animation: "sway 0.9s ease-in-out infinite" }}>
                        <Ink name="steam-b" width="14px" color="currentColor" />
                      </span>
                      Steeping…
                    </span>
                  </button>
                  <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener" className="text-sm text-[var(--moss)] underline-offset-4 hover:text-[var(--clay)] hover:underline">
                    or add it via GitHub
                  </a>
                </div>
              </form>

              <Preview form={form} />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

function Preview({ form }: { form: Form }) {
  const word = form.word.trim() || "Your pun";
  return (
    <aside className="rounded-2xl bg-[var(--paper)] p-6 shadow-[inset_0_0_0_1px_var(--line)] md:sticky md:top-20 md:self-start sm:p-7" aria-label="Live preview">
      <p className="text-sm font-semibold text-[var(--moss)]">Preview</p>
      <p className={`display mt-3 break-words text-[clamp(1.9rem,4vw,2.5rem)] transition-colors duration-300 ${form.word ? "text-[var(--forest)]" : "text-[color-mix(in_oklab,var(--forest)_35%,transparent)]"}`}>{word}</p>
      <p className="mt-2 text-sm text-[var(--moss)]">
        <span className="italic">[ {form.sayIt.trim() || form.word.trim() || "Say-It"} ]</span>
        <span className="mx-2 opacity-40">·</span>a play on <span className="font-semibold text-[var(--ink)]">{form.wordplay.trim() || "…"}</span>
      </p>
      <blockquote className="quote mt-5 text-lg font-medium leading-snug tracking-[-0.015em] text-[var(--ink)] break-words">
        {form.sentence.trim() || "Use it in a sentence."}
      </blockquote>
      <p className="mt-4 break-words leading-relaxed text-[var(--forest)]">{form.definition.trim() || "And tell us what it means."}</p>
      <p className="mt-5 text-sm text-[var(--moss)]">
        by <span className="font-semibold text-[var(--forest)]">{form.author.trim() || "Anonymous"}</span>
      </p>
    </aside>
  );
}

function TextField({
  id,
  label,
  hint,
  value,
  onChange,
  max,
  invalid,
  required,
  optional,
  multiline,
  rows,
  autoFocus,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  max: number;
  invalid: boolean;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
}) {
  const near = value.length > max * 0.8;
  const common = { id, value, onChange, maxLength: max, placeholder: hint, "aria-invalid": invalid, "aria-required": required, autoFocus, className: "field" };
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="font-semibold">
          {label} {optional && <span className="font-normal text-[var(--moss)]">(optional)</span>}
        </label>
        <span className={`text-xs tabular-nums transition-opacity duration-200 ${near ? "opacity-100" : "opacity-0"} ${value.length >= max ? "text-[var(--clay)]" : "text-[var(--moss)]"}`} aria-hidden>
          {value.length}/{max}
        </span>
      </div>
      {multiline ? <textarea {...common} rows={rows} className="field resize-none" /> : <input {...common} type="text" />}
    </div>
  );
}
