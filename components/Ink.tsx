import type { CSSProperties } from "react";
import { ART, type ArtName } from "@/lib/art";

/** A hand-drawn piece rendered as a CSS mask, so it can take any colour. */
export function Ink({
  name,
  width,
  color = "currentColor",
  className = "",
  style,
  label,
}: {
  name: string;
  width: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  const [w, h] = ART[name as ArtName] ?? [1, 1];
  const url = `url(/art/${name}.png)`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`ink ${className}`}
      style={{
        width,
        aspectRatio: `${w} / ${h}`,
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        ...style,
      }}
    />
  );
}
