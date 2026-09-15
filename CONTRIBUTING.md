# Contributing a pun

1. Fork the repo.
2. Add an entry to `SEED_PUNS` in [`data/puns.ts`](data/puns.ts):

```ts
{
  word: "Guiltea",
  sayIt: "Gill-Tee",
  wordplay: "Guilty",
  sentence: "Late night Yunnan black post 4pm. Guiltea.",
  definition: "The warm shame of caffeine after dark.",
  author: "Your name",
},
```

3. Open a pull request.

Guidelines:

- **One pun per word.** Search the site first.
- **Keep it kind.** No slurs and nothing aimed at real people.
- **Keep it short.** Aim for a one-line sentence and a definition of one or two sentences.
- **Tea-related.** Any tea, any culture.

You can also improve the code. Run `npm run lint` and `npm run build` before opening a PR.
