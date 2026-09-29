import { curatedSuggestions, PACKS, type Comfort, type PackId } from "@/lib/plus";

const comforts: readonly Comfort[] = ["gentle", "steady", "bold"];
const packIds = new Set<string>(PACKS.map(pack => pack.id));

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 4096) {
    return Response.json({ error: "Suggestion request is too large." }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json({ error: "Invalid suggestion request." }, { status: 400 });
  }
  if (raw.length > 4096) {
    return Response.json({ error: "Suggestion request is too large." }, { status: 413 });
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return Response.json({ error: "Invalid suggestion request." }, { status: 400 });
  }

  const body = value as Record<string, unknown>;
  const interests = Array.isArray(body.interests)
    ? [...new Set(body.interests.filter((item): item is PackId => typeof item === "string" && packIds.has(item)))]
    : [];
  const comfort = body.comfort;
  const offset = body.offset ?? 0;
  if (!interests.length) {
    return Response.json({ error: "Choose at least one valid interest." }, { status: 400 });
  }
  if (typeof comfort !== "string" || !comforts.includes(comfort as Comfort)) {
    return Response.json({ error: "Choose a valid comfort level." }, { status: 400 });
  }
  if (!Number.isSafeInteger(offset) || (offset as number) < 0) {
    return Response.json({ error: "Suggestion offset must be a non-negative integer." }, { status: 400 });
  }

  return Response.json({
    suggestions: curatedSuggestions(interests, comfort as Comfort, offset as number),
    source: "curated",
  });
}