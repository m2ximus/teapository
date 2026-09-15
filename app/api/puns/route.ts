import { addPun, allow, moderated, redis, slugTaken } from "@/lib/store";
import { clientKey } from "@/lib/request";
import { LIMITS, slugify } from "@/lib/text";
import type { PunInput } from "@/lib/types";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!redis) return Response.json({ error: "Submissions aren't set up on this copy of the Teapository." }, { status: 503 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot: real people never see this field.
  if (clean(body.website, 200)) return Response.json({ ok: true, live: false, slug: "" });

  const input: PunInput = {
    word: clean(body.word, LIMITS.word),
    sayIt: clean(body.sayIt, LIMITS.sayIt),
    wordplay: clean(body.wordplay, LIMITS.wordplay),
    sentence: clean(body.sentence, LIMITS.sentence),
    definition: clean(body.definition, LIMITS.definition),
    author: clean(body.author, LIMITS.author) || "Anonymous",
  };

  const missing = (["word", "wordplay", "sentence", "definition"] as const).filter((k) => !input[k]);
  if (missing.length) return Response.json({ error: "A pun needs a word, what it plays on, a sentence and a definition.", fields: missing }, { status: 400 });
  if (!input.sayIt) input.sayIt = input.word;
  if (/https?:\/\/|www\./i.test(Object.values(input).join(" "))) {
    return Response.json({ error: "No links please, just puns." }, { status: 400 });
  }
  if (!slugify(input.word)) return Response.json({ error: "That word needs at least one letter or number.", fields: ["word"] }, { status: 400 });

  if (!(await allow("submit", await clientKey(), 8, 3600))) {
    return Response.json({ error: "That's a lot of puns for one hour. Brew another pot and come back later." }, { status: 429 });
  }

  if (await slugTaken(slugify(input.word))) {
    return Response.json({ error: `“${input.word}” is already in the Teapository. Try a different spin.`, fields: ["word"] }, { status: 409 });
  }

  const result = await addPun(input);
  if (!result) return Response.json({ error: "Someone just beat you to that one.", fields: ["word"] }, { status: 409 });
  return Response.json({ ok: true, ...result, moderated });
}
