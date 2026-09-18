import Image from "next/image";
import type { Banner as BannerData } from "@/data/banners";
import { Arrow } from "./icons";

export function Banner({ banner, variant }: { banner: BannerData; variant: "rail" | "inline" }) {
  const rail = variant === "rail";
  return (
    <a
      href={banner.href}
      target="_blank"
      rel="noopener"
      className={`banner group relative isolate flex overflow-hidden rounded-2xl text-[var(--cream)] ${
        rail ? "aspect-[9/16] w-full flex-col justify-end p-5" : "min-h-56 flex-col justify-end p-6 sm:min-h-44 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
      }`}
    >
      <Image src={banner.image} alt={banner.alt} fill sizes={rail ? "220px" : "(max-width: 768px) 100vw, 720px"} className="-z-20 object-cover" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(23,58,42,0.92)] via-[rgba(23,58,42,0.45)] to-transparent" />
      <span className="tag absolute left-4 top-4 bg-[rgba(23,58,42,0.72)] text-[0.7rem]">Sponsored</span>
      <span className="flex flex-col">
        <span className={`display ${rail ? "text-[1.45rem]" : "text-[1.7rem]"}`}>{banner.title}</span>
        <span className="mt-1.5 text-sm font-semibold text-[var(--ochre-light)]">{banner.eyebrow}</span>
        <span className="mt-1 text-sm leading-snug text-[rgba(241,235,224,0.86)] text-pretty">{banner.body}</span>
      </span>
      <span className={`btn mt-4 self-start bg-[var(--cream)] px-4 py-2 text-sm text-[var(--forest)] ${rail ? "" : "sm:mt-0 sm:self-auto"}`}>
        {banner.cta} <Arrow />
      </span>
    </a>
  );
}
