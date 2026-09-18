export type SeedPun = {
  word: string;
  /** How to say it, shown in [ brackets ]. */
  sayIt: string;
  /** The word or phrase being punned on. */
  wordplay: string;
  /** The pun, said in a sentence. */
  sentence: string;
  definition: string;
  author?: string;
};

export type Pun = Required<SeedPun> & {
  slug: string;
  votes: number;
  createdAt: number;
  community: boolean;
};

export type PunInput = Omit<SeedPun, "author"> & { author: string };
