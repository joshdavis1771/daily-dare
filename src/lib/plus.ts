export const PLUS_KEY = "daily-dare-plus-v1";
export const PLUS_EVENT = "daily-dare-plus-updated";
export const PLUS_GROUP_LIMIT = 50;
export const FREE_DARE_COUNT = 465;
export const PLUS_DARE_COUNT = 10000;
export const PLUS_PROMO_CODE = "FRIENDS100";
export const PLUS_PLANS = ["Monthly", "Yearly", "Founding"] as const;
export type PlusPlan = typeof PLUS_PLANS[number];
export const THEMES = ["teal", "violet", "sunset"] as const;
export const AVATARS = ["🌱", "🌞", "🪩", "⚡", "🌊", "🦋"] as const;
export type Comfort = "gentle" | "steady" | "bold";
export type PackId = "fitness" | "creativity" | "confidence" | "couples" | "wellbeing" | "outdoors" | "food" | "learning" | "connection" | "home";
export type PlusDare = { id: string; title: string; instructions: string; category: PackId; comfort: Comfort };
export type GroupDraft = { id: string; name: string; members: string[] };
export type CustomDare = PlusDare & { audience: string; completedAt?: string };
export type PlusState = {
  version: 1; enabled: boolean; activatedAt: string | null;
  plan: PlusPlan;
  skips: number; retries: number; retryWeek: string; groups: GroupDraft[]; dares: CustomDare[];
  savedPacks: PackId[]; completed: Record<string, string>;
  profile: { name: string; bio: string; avatar: string; theme: typeof THEMES[number]; icon: typeof THEMES[number] };
};
import { validateUserText } from "./utils";
export const EMPTY_PLUS: PlusState = {
  version: 1, enabled: false, activatedAt: null, plan: "Yearly", skips: 3, retries: 3, retryWeek: "", groups: [], dares: [], savedPacks: [], completed: {},
  profile: { name: "", bio: "", avatar: "", theme: "teal", icon: "teal" },
};
const BASE_PACKS: { id: PackId; title: string; description: string; emoji: string; tint: string; dares: PlusDare[] }[] = [
  { id: "fitness", title: "Find your rhythm", description: "Small moves. A little more energy.", emoji: "🌿", tint: "mint", dares: [
    { id: "fit-1", title: "A one-song stretch", instructions: "Put on a favourite song and gently stretch in a way that feels comfortable. Share a photo of your setup or a short clip.", category: "fitness", comfort: "gentle" },
    { id: "fit-2", title: "Take the scenic route", instructions: "Take a five-minute walk or roll somewhere accessible. Capture one detail you normally miss.", category: "fitness", comfort: "steady" },
    { id: "fit-3", title: "Make your own mini routine", instructions: "Combine three comfortable movements into a short routine. Move at your own pace and stop if anything hurts.", category: "fitness", comfort: "bold" },
  ] },
  { id: "creativity", title: "Make a little magic", description: "No talent required. Just curiosity.", emoji: "🎨", tint: "lavender", dares: [
    { id: "art-1", title: "Find your colour", instructions: "Find three everyday things in your favourite colour. Arrange them and take a photo.", category: "creativity", comfort: "gentle" },
    { id: "art-2", title: "The 60-second sketch", instructions: "Draw the nearest object without lifting your pen. Celebrate the wobbly lines.", category: "creativity", comfort: "steady" },
    { id: "art-3", title: "Tell a tiny story", instructions: "Make a three-frame photo story using objects you already own. Give it a surprising title.", category: "creativity", comfort: "bold" },
  ] },
  { id: "confidence", title: "A little braver", description: "Gentle steps outside your usual.", emoji: "✨", tint: "peach", dares: [
    { id: "con-1", title: "Give yourself some credit", instructions: "Write down one thing you handled well this week. Keep private details out of your photo.", category: "confidence", comfort: "gentle" },
    { id: "con-2", title: "Try a new combination", instructions: "Style an outfit using something you rarely wear. Take a photo just for yourself or your group.", category: "confidence", comfort: "steady" },
    { id: "con-3", title: "Your tiny victory speech", instructions: "Record a short celebration of something you learned. You choose who, if anyone, gets to see it.", category: "confidence", comfort: "bold" },
  ] },
  { id: "couples", title: "Better together", description: "A little more us-time.", emoji: "💌", tint: "rose", dares: [
    { id: "cou-1", title: "A note worth keeping", instructions: "Write your partner a kind note about an everyday thing you appreciate. Share only what you both want to share.", category: "couples", comfort: "gentle" },
    { id: "cou-2", title: "Trade favourite songs", instructions: "Each choose a favourite song, listen together, and explain what you love about it.", category: "couples", comfort: "steady" },
    { id: "cou-3", title: "Invent your next date", instructions: "Together, plan a free mini date using three things you already have. Both of you get a veto.", category: "couples", comfort: "bold" },
  ] },
  { id: "wellbeing", title: "Feel more grounded", description: "Small rituals for a steadier day.", emoji: "🌊", tint: "mint", dares: [{ id: "well-1", title: "A quiet reset", instructions: "Take two minutes to notice what you need next.", category: "wellbeing", comfort: "gentle" }] },
  { id: "outdoors", title: "Step outside", description: "Notice more of the world around you.", emoji: "🌤️", tint: "mint", dares: [{ id: "out-1", title: "Look up", instructions: "Find one detail above eye level and remember it.", category: "outdoors", comfort: "gentle" }] },
  { id: "food", title: "Make it delicious", description: "Turn everyday food into a tiny celebration.", emoji: "🍋", tint: "peach", dares: [{ id: "food-1", title: "A mindful bite", instructions: "Slow down for one bite and notice its texture and flavour.", category: "food", comfort: "gentle" }] },
  { id: "learning", title: "Stay curious", description: "Follow one small question wherever it leads.", emoji: "📚", tint: "lavender", dares: [{ id: "learn-1", title: "Ask why", instructions: "Write down one question and spend five minutes exploring it.", category: "learning", comfort: "gentle" }] },
  { id: "connection", title: "Reach out", description: "Make room for meaningful little connections.", emoji: "💬", tint: "rose", dares: [{ id: "connect-1", title: "Send warmth", instructions: "Send a thoughtful message with no request attached.", category: "connection", comfort: "gentle" }] },
  { id: "home", title: "Make space", description: "Create a little more ease where you live.", emoji: "🪴", tint: "peach", dares: [{ id: "home-1", title: "One small corner", instructions: "Make one small corner more welcoming for tomorrow.", category: "home", comfort: "gentle" }] },
];
const dareExpansion: Record<PackId, { subjects: string[]; actions: string[]; details: string[] }> = {
  fitness: { subjects: ["your morning", "a favourite song", "your front door", "a quiet corner", "your lunch break", "the nearest park", "your evening wind-down", "a familiar route", "your desk", "the next five minutes"], actions: ["stretch gently", "take a mindful walk", "try three comfortable movements", "notice your breathing", "change your pace", "reach and reset", "dance for one song", "pause for a body scan", "explore a new route", "finish with a calm reset"], details: ["Stop whenever your body asks you to.", "Keep it comfortable and choose your own pace.", "No performance is needed; simply notice how it feels.", "Adapt the movement to suit your space and ability.", "Capture one detail from the moment if you want to remember it."] },
  creativity: { subjects: ["three colours", "the nearest object", "a window view", "your favourite phrase", "a pocket-sized story", "an everyday texture", "a familiar song", "a tiny collection", "your breakfast", "an ordinary corner"], actions: ["make a quick sketch", "write six lines", "take three photos", "build a small arrangement", "invent a new title", "make a tiny collage", "describe it in a surprising way", "turn it into a pattern", "record a one-minute idea", "reframe it as a story"], details: ["Let it be playful rather than polished.", "Use only what you already have nearby.", "Give yourself one minute and follow your curiosity.", "There is no wrong version of this experiment.", "Keep the result private or share it with your circle."] },
  confidence: { subjects: ["something you handled well", "a small preference", "a recent lesson", "your everyday outfit", "a kind thought", "a useful boundary", "a question you have", "a quiet win", "your next step", "a quality you value"], actions: ["write yourself a note", "say it out loud", "choose with intention", "ask for what you need", "celebrate the effort", "try a small new choice", "name what matters", "share a gentle truth", "practice receiving a compliment", "take one brave step"], details: ["Keep the step small enough to feel possible.", "You decide whether anyone else sees it.", "There is no need to perform confidence.", "A quiet attempt still counts as showing up.", "Stop or change course if it does not feel right."] },
  couples: { subjects: ["a shared memory", "your next free evening", "a favourite meal", "an everyday habit", "a song you both know", "a place nearby", "something you appreciate", "a silly question", "a future idea", "a quiet moment"], actions: ["write a kind note", "take turns answering", "make a small plan", "share a favourite", "try a new ritual", "give a sincere compliment", "recreate a memory", "invent a tiny tradition", "listen without fixing", "celebrate the ordinary"], details: ["Both people get a comfortable way to participate.", "Keep it low-pressure and make room for a veto.", "The point is connection, not a perfect result.", "Share only what you both want to keep private.", "Let the moment be simple and unhurried."] },
  wellbeing: { subjects: ["your energy", "a quiet pause", "your senses", "your sleep routine", "a comfortable place", "your attention", "a kind boundary", "your breathing", "a small comfort", "the next hour"], actions: ["take a gentle pause", "write a check-in", "make a calming ritual", "put one thing down", "choose a softer option", "notice five details", "make room for rest", "clear one small worry", "name what is enough", "end with gratitude"], details: ["There is no need to optimize the moment.", "Choose what feels supportive today.", "Keep it brief and pressure-free.", "You can adapt this to your own needs.", "Let enough be enough."] },
  outdoors: { subjects: ["the sky", "a nearby path", "a tree", "your street", "a patch of sunlight", "a sound outside", "a changing shadow", "a local landmark", "a cloud", "the weather"], actions: ["notice one detail", "take a slow stroll", "find a new viewpoint", "photograph a pattern", "listen without headphones", "follow a colour", "pause at a doorway", "look for signs of change", "trace a familiar route", "bring one detail home"], details: ["Stay within a route that feels comfortable.", "You do not need to go far.", "Notice without needing to name everything.", "Bring a friend or choose a familiar place if helpful.", "The smallest outing counts."] },
  food: { subjects: ["a snack", "your morning drink", "a leftover", "one ingredient", "a family recipe", "a market aisle", "your next meal", "a crunchy bite", "a warm bowl", "a simple dessert"], actions: ["slow down and taste", "arrange it beautifully", "try a new combination", "write a flavour note", "make a tiny ritual", "share a recipe", "notice the texture", "add one bright detail", "serve it with care", "celebrate the first bite"], details: ["Use what you already have.", "Keep it accessible and easy.", "There is no need to make it perfect.", "Notice pleasure without rushing it.", "Share only what feels comfortable."] },
  learning: { subjects: ["a word", "a local fact", "a how-to question", "a historical detail", "a new skill", "a familiar idea", "a useful shortcut", "a book page", "a curious sound", "a small mystery"], actions: ["look it up", "teach it back", "make three notes", "draw a simple map", "ask a better question", "try a five-minute lesson", "compare two ideas", "explain it simply", "find a practical use", "save one useful fact"], details: ["Follow curiosity rather than perfection.", "Five minutes is enough to begin.", "Keep your notes in a place you can revisit.", "You can stop when the question feels answered.", "Share the discovery if you feel like it."] },
  connection: { subjects: ["a friend", "a neighbour", "a family member", "a colleague", "someone you miss", "a shared memory", "a quiet thank-you", "a group chat", "a helpful person", "your future self"], actions: ["send a warm message", "ask a real question", "offer appreciation", "share a small joy", "make a low-pressure plan", "listen closely", "leave a kind note", "check in gently", "celebrate their effort", "say thank you"], details: ["Do not expect a reply right away.", "Keep the invitation easy to decline.", "A small message can be enough.", "Respect privacy and personal boundaries.", "Connection works best without pressure."] },
  home: { subjects: ["a drawer", "your entryway", "a bedside surface", "a shelf", "your workspace", "a plant", "a cosy corner", "your laundry routine", "a shared space", "tomorrow morning"], actions: ["reset one surface", "make it easier to use", "remove three things", "add a welcoming detail", "prepare for tomorrow", "repair one tiny annoyance", "let more light in", "create a drop zone", "make a comfort station", "finish a five-minute task"], details: ["Stop after the small win.", "Use what you already have.", "Aim for ease rather than perfection.", "Choose the smallest useful version.", "Notice how the space feels afterward."] }
};
function expandDares(pack: (typeof BASE_PACKS)[number]): PlusDare[] {
  const templates = dareExpansion[pack.id];
  const expanded = [...pack.dares];
  for (let index = expanded.length; index < 1000; index++) {
    const subject = templates.subjects[index % templates.subjects.length];
    const action = templates.actions[Math.floor(index / templates.subjects.length) % templates.actions.length];
    const detail = templates.details[Math.floor(index / (templates.subjects.length * templates.actions.length)) % templates.details.length];
    expanded.push({ id: `${pack.id}-${index + 1}`, title: `${action.charAt(0).toUpperCase()}${action.slice(1)}: ${subject}`, instructions: `${action} with ${subject}. ${detail}`, category: pack.id, comfort: (["gentle", "steady", "bold"] as Comfort[])[index % 3] });
  }
  return expanded;
}
export const PACKS = BASE_PACKS.map(pack => ({ ...pack, dares: expandDares(pack) }));
export function curatedSuggestions(interests: PackId[], comfort: Comfort, offset = 0): PlusDare[] {
  const levels: Comfort[] = ["gentle", "steady", "bold"];
  const eligible = PACKS.filter(p => interests.includes(p.id)).flatMap(p => p.dares).filter(d => levels.indexOf(d.comfort) <= levels.indexOf(comfort));
  if (!eligible.length) return [];
  const start = ((offset % eligible.length) + eligible.length) % eligible.length;
  return [...eligible.slice(start), ...eligible.slice(0, start)].slice(0, 3);
}
export function activatePlus(state: PlusState): PlusState {
  return { ...state, enabled: true, activatedAt: state.activatedAt ?? new Date().toISOString() };
}
export function redeemPlusPromo(state: PlusState, code: string): PlusState {
  if (code.trim().toUpperCase() !== PLUS_PROMO_CODE) throw new Error("That promo code is not valid.");
  return activatePlus(state);
}
export function currentWeekKey(date = new Date()) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}
export function refreshWeeklyTokens(state: PlusState): PlusState {
  const week = currentWeekKey();
  return state.retryWeek === week ? state : { ...state, skips: 3, retries: 3, retryWeek: week };
}
export function requirePlus(state: PlusState) {
  if (!state.enabled) throw new Error("Start your free Plus preview to use this feature.");
}
export function spendToken(state: PlusState, kind: "skips" | "retries"): PlusState {
  requirePlus(state);
  const current = refreshWeeklyTokens(state);
  if (current[kind] < 1) throw new Error(`No ${kind === "skips" ? "skip" : "try again"} tokens left${kind === "retries" ? " this week" : " in this preview"}.`);
  return { ...current, [kind]: current[kind] - 1 };
}
export function addGroup(state: PlusState, name: string, members: string[]): PlusState {
  requirePlus(state);
  const cleanName = name.trim();
  const cleanMembers = [...new Set(members.map(m => m.trim()).filter(Boolean))];
  if (validateUserText(`${cleanName} ${cleanMembers.join(" ")}`)) throw new Error("Please remove inappropriate language before saving this circle.");
  if (!cleanName || cleanName.length > 50) throw new Error("Give your group a name of 1–50 characters.");
  if (cleanMembers.length + 1 > PLUS_GROUP_LIMIT) throw new Error(`Plus groups support ${PLUS_GROUP_LIMIT} people, including you.`);
  if (cleanMembers.some(m => m.length > 60)) throw new Error("Keep each member name under 60 characters.");
  return { ...state, groups: [...state.groups, { id: crypto.randomUUID(), name: cleanName, members: cleanMembers }] };
}
export function addCustomDare(state: PlusState, dare: Omit<CustomDare, "id">): PlusState {
  requirePlus(state);
  if (validateUserText(`${dare.title} ${dare.instructions} ${dare.audience}`)) throw new Error("Please remove inappropriate language before saving this dare.");
  if (!dare.title.trim() || dare.title.length > 80 || !dare.instructions.trim() || dare.instructions.length > 500) throw new Error("Add a title (up to 80 characters) and instructions (up to 500).");
  if (!dare.audience.trim() || dare.audience.length > 100) throw new Error("Choose who this dare is for.");
  return { ...state, dares: [{ ...dare, title: dare.title.trim(), instructions: dare.instructions.trim(), id: crypto.randomUUID() }, ...state.dares] };
}
export function longestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort();
  let best = 0, run = 0, previous = NaN;
  for (const date of sorted) { const stamp = Date.parse(`${date}T12:00:00Z`); run = stamp - previous === 86400000 ? run + 1 : 1; best = Math.max(best, run); previous = stamp; }
  return best;
}
