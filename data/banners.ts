/**
 * Banner slots. Rails show on wide screens; `inline` banners sit between entries on smaller ones.
 * Swap the copy, image or link to publicise anything. Images live in /public.
 */
export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

export const BANNERS: Banner[] = [
  {
    id: "festival",
    eyebrow: "Lisbon · 17–18 Oct",
    title: "Até Chá Tea Festival",
    body: "Growers, gongfu, gong baths and no strangers.",
    cta: "Get involved",
    href: "https://atecha.co",
    image: "/banner-fields.jpg",
    alt: "Sunlight through tea leaves",
  },
  {
    id: "teacompression",
    eyebrow: "Azores · 19–22 Oct",
    title: "Teacompression",
    body: "Where tea, water and landscape meet on São Miguel.",
    cta: "Join the journey",
    href: "https://atecha.co",
    image: "/banner-fields.jpg",
    alt: "Tea leaves glowing in afternoon light",
  },
];
