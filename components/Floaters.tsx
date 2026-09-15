"use client";

import { useEffect, useRef } from "react";
import { Ink } from "./Ink";

type Piece = { name: string; x: string; y: string; w: string; depth: number; t: number; r: number; dx: number; dy: number; mx?: string; my?: string; hideSm?: boolean };

// Kept to the hero's edges so the search stays calm. `hideSm` drops clutter on phones.
const HOME: Piece[] = [
  { name: "teapot", x: "3%", y: "12%", w: "clamp(90px, 11vw, 180px)", depth: 8, t: 21, r: 4, dx: 26, dy: 18, hideSm: true },
  { name: "ship", x: "84%", y: "8%", w: "clamp(70px, 8vw, 130px)", depth: 10, t: 19, r: 5, dx: -18, dy: 22, hideSm: true },
  { name: "octopus", x: "-3%", y: "56%", w: "clamp(110px, 14vw, 220px)", depth: 18, t: 26, r: 6, dx: 22, dy: -30, hideSm: true },
  { name: "panda2", x: "86%", y: "54%", w: "clamp(80px, 9vw, 150px)", depth: 14, t: 23, r: 7, dx: -24, dy: -18, hideSm: true },
  { name: "steam-cup-3", x: "20%", y: "28%", w: "clamp(30px, 3.4vw, 54px)", depth: 24, t: 17, r: 8, dx: 12, dy: -22, hideSm: true },
  { name: "cup-v", x: "74%", y: "34%", w: "clamp(28px, 3vw, 46px)", depth: 30, t: 15, r: 10, dx: -16, dy: 16, hideSm: true },
  { name: "wave", x: "88%", y: "4%", w: "clamp(24px, 2.6vw, 40px)", depth: 34, t: 13, r: 12, dx: -10, dy: 26 },
  { name: "steam-a", x: "8%", y: "4%", w: "clamp(22px, 2.4vw, 36px)", depth: 28, t: 14, r: 10, dx: 14, dy: 16 },
];

export function Floaters({ pieces = HOME, color = "var(--forest)", dim = false }: { pieces?: Piece[]; color?: string; dim?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty("--py", String((e.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000"
      style={{ opacity: dim ? 0.18 : 1 }}
    >
      {pieces.map((p, i) => (
        <div
          key={p.name + i}
          className="floater"
          data-sm={p.hideSm ? "hide" : undefined}
          style={
            {
              "--y": p.y,
              "--my": p.my,
              "--x": p.x,
              "--mx": p.mx,
              "--t": `${p.t}s`,
              "--delay": `${-i * 2.3}s`,
              "--r": `${p.r}deg`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as React.CSSProperties
          }
        >
          <div className="parallax" style={{ "--depth": p.depth } as React.CSSProperties}>
            <div className="enter" style={{ animationDelay: `${300 + i * 90}ms` }}>
              <Ink name={p.name} width={p.w} color={color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
