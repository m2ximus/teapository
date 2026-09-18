import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PunEntry } from "@/components/PunEntry";
import { Back } from "@/components/icons";
import { voterId } from "@/lib/request";
import { getPun, redis, votedBy } from "@/lib/store";

export async function generateMetadata({ params }: PageProps<"/pun/[slug]">): Promise<Metadata> {
  const pun = await getPun((await params).slug);
  if (!pun) return { title: "Pun not found · Teapository" };
  const title = `${pun.word} · Teapository`;
  const description = `“${pun.sentence}” ${pun.definition}`;
  return { title, description, openGraph: { title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default async function PunPage({ params }: PageProps<"/pun/[slug]">) {
  const { slug } = await params;
  const [pun, voted] = await Promise.all([getPun(slug), voterId().then(votedBy)]);
  if (!pun) notFound();
  const live = !!redis;
  return (
    <>
      <Header canSubmit={live} />
      <main className="mx-auto max-w-[720px] px-5 pt-16 sm:px-8 sm:pt-24">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--moss)] transition-colors hover:text-[var(--clay)]">
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1"><Back /></span> All puns
        </Link>
        <div className="rise">
          <PunEntry pun={pun} voted={voted.includes(pun.slug)} canVote={live} as="h1" />
        </div>
      </main>
      <Footer />
    </>
  );
}
