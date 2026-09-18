import { ImageResponse } from "next/og";
import { getPun } from "@/lib/store";

export const alt = "A tea pun from the Teapository";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function titleFont() {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@700")).text();
    const src = css.match(/src: url\((.+?)\) format/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const pun = await getPun((await params).slug);
  const font = await titleFont();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f1ebe0", color: "#173a2a" }}>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#b8532a" }}>Teapository</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: font ? "Title" : "sans-serif", fontSize: 120, lineHeight: 1, letterSpacing: -4 }}>{pun?.word ?? "Tea puns"}</div>
          {pun && (
            <div style={{ display: "flex", fontSize: 30, color: "#4d5e2e", marginTop: 20 }}>
              [ {pun.sayIt} ] · a play on {pun.wordplay}
            </div>
          )}
          {pun && <div style={{ display: "flex", fontSize: 40, marginTop: 32, maxWidth: 1000, color: "#1c2a22" }}><span style={{ color: "#b8532a" }}>“</span>{pun.sentence}<span style={{ color: "#b8532a" }}>”</span></div>}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#4d5e2e" }}>teapository.vercel.app · by Até Chá, Lisbon</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Title", data: font, weight: 700, style: "normal" }] : [] },
  );
}
