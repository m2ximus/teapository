import Link from "next/link";
import { AddPun } from "./AddPun";
import { Ink } from "./Ink";

export function Header({ canSubmit }: { canSubmit: boolean }) {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
      <Link href="/" aria-label="Teapository home, by Até Chá" className="transition-opacity duration-300 hover:opacity-70">
        <Ink name="atecha-word" width="54px" color="var(--forest)" />
      </Link>
      <AddPun canSubmit={canSubmit} />
    </header>
  );
}
