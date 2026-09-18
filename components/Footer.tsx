import { FESTIVAL_URL, REPO_URL } from "@/lib/text";
import { Arrow } from "./icons";
import { Ink } from "./Ink";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--line)] px-5 pb-12 pt-16 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Ink name="cat" width="clamp(96px, 14vw, 132px)" color="var(--ink)" label="Até Chá cat" />
        <p className="display mt-6 text-[clamp(1.9rem,4vw,2.8rem)]">Now come and pour one with us.</p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--moss)] text-pretty">
          Até Chá is a tea festival in Lisbon this October. Tea masters, growers, gongfu, breath, sound and slow conversation,
          with no strangers.
        </p>
        <a href={FESTIVAL_URL} target="_blank" rel="noopener" className="btn btn-solid mt-8 px-6 py-3.5">
          Discover Até Chá <Arrow />
        </a>
        <a href={FESTIVAL_URL} target="_blank" rel="noopener" className="mt-4 text-sm text-[var(--moss)] underline-offset-4 hover:underline">
          atecha.co
        </a>
      </div>
      <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-[var(--moss)] sm:flex-row">
        <span>Teapository is open source. Every pun belongs to all of us.</span>
        <a href={REPO_URL} target="_blank" rel="noopener" className="underline-offset-4 hover:text-[var(--clay)] hover:underline">
          Fork it on GitHub
        </a>
      </div>
    </footer>
  );
}
