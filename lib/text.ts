/** Accent- and punctuation-insensitive form used for slugs, search and letters. */
export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const slugify = (s: string) =>
  fold(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const letterOf = (word: string) => {
  const c = fold(word).replace(/[^a-z]/g, "")[0];
  return c ? c.toUpperCase() : "#";
};

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const SITE_URL = "https://teapository.vercel.app";
export const FESTIVAL_URL = "https://atecha.co";
export const REPO_URL = "https://github.com/m2ximus/teapository";

export const LIMITS = { word: 40, sayIt: 60, wordplay: 80, sentence: 220, definition: 400, author: 40 } as const;
