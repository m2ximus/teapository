import { allow, redis, toggleVote } from "@/lib/store";
import { clientKey, voterId } from "@/lib/request";

export async function POST(request: Request) {
  if (!redis) return Response.json({ error: "Voting isn't set up on this copy of the Teapository." }, { status: 503 });
  const { slug } = (await request.json().catch(() => ({}))) as { slug?: unknown };
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,60}$/.test(slug)) return Response.json({ error: "Unknown pun" }, { status: 400 });

  // Generous per-IP limit: a festival crowd can share one wifi network.
  if (!(await allow("vote", await clientKey(), 120, 600))) {
    return Response.json({ error: "Easy there. Let the tea settle and try again in a few minutes." }, { status: 429 });
  }

  const result = await toggleVote(slug, (await voterId(true))!);
  if (!result) return Response.json({ error: "Unknown pun" }, { status: 404 });
  return Response.json(result);
}
