import type { Challenge, Comment, MessageThread, Post, Profile } from "./types";

export const demoProfiles: Profile[] = [
  { id: "p1", username: "dailydare", displayName: "Daily Dare", bio: "Tiny rituals, big energy. ✨", avatarUrl: "/icons/daily-dare-new.png", followers: 1280, following: 184, isFollowing: true },
  { id: "p2", username: "alexafterhours", displayName: "Alex Rivera", bio: "Finding the fun in showing up.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80", followers: 842, following: 231, streak: 8, isFollowing: true, isPlus: true },
  { id: "p3", username: "jordan.joy", displayName: "Jordan Brooks", bio: "Good days are built, not found.", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80", followers: 2190, following: 96, streak: 21 },
  { id: "p4", username: "sunday.sage", displayName: "Sage Williams", bio: "Soft mornings and brave tries.", avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80", followers: 516, following: 143, streak: 4 },
];

export const demoMessages: MessageThread[] = [
  { id: "thread-maya", name: demoProfiles[0].displayName, username: demoProfiles[0].username, avatarUrl: demoProfiles[0].avatarUrl, messages: [{ body: "That commute dare was exactly what I needed today.", fromMe: false, createdAt: "12 min ago" }, { body: "The tiny shoulder shimmy made my whole morning.", fromMe: true, createdAt: "8 min ago" }] },
  { id: "thread-alex", name: demoProfiles[1].displayName, username: demoProfiles[1].username, avatarUrl: demoProfiles[1].avatarUrl, messages: [{ body: "Are you doing today’s five-second groove?", fromMe: false, createdAt: "34 min ago" }] },
  { id: "thread-jordan", name: demoProfiles[2].displayName, username: demoProfiles[2].username, avatarUrl: demoProfiles[2].avatarUrl, messages: [{ body: "Your long way home post made me want to wander.", fromMe: false, createdAt: "1 hr ago" }] },
  { id: "thread-sage", name: demoProfiles[3].displayName, username: demoProfiles[3].username, avatarUrl: demoProfiles[3].avatarUrl, messages: [{ body: "Soft mornings and brave tries.", fromMe: false, createdAt: "2 hr ago" }] },
];

export const todaysChallenges: Challenge[] = [
  {
  id: "c-today",
  title: "Make your ordinary iconic",
  instructions: "Turn one everyday moment into a 10-second celebration. Add a move, a grin, or a dramatic reveal.",
  category: "Joy",
  difficulty: "gentle",
  date: "2026-09-16",
  accent: "coral",
  },
  { id: "c-today-2", title: "Find your five-second groove", instructions: "Add a tiny dance break to something you already do today. Keep it joyful and unmistakably yours.", category: "Movement", difficulty: "steady", date: "2026-09-16", accent: "blue" },
  { id: "c-today-3", title: "Send a little sunshine", instructions: "Send someone a kind message and show us the moment you hit send.", category: "People", difficulty: "gentle", date: "2026-09-16", accent: "yellow" },
  { id: "c-today-4", title: "Make the ordinary delicious", instructions: "Turn a snack, drink, or meal into a tiny ceremony worthy of a close-up.", category: "Ritual", difficulty: "bold", date: "2026-09-16", accent: "mint" },
];

export const todayChallenge = todaysChallenges[0];

export const challenges: Challenge[] = [
  ...todaysChallenges,
  { id: "c-1", title: "Take the scenic route", instructions: "Walk somewhere you usually rush past and show us what you notice.", category: "Outside", difficulty: "steady", date: "2026-09-15", accent: "blue" },
  { id: "c-2", title: "Compliment in public", instructions: "Give someone a sincere compliment and capture your reaction after.", category: "People", difficulty: "bold", date: "2026-09-14", accent: "yellow" },
  { id: "c-3", title: "Five-minute reset", instructions: "Reset one tiny corner of your world. Before, after, and one proud nod.", category: "Home", difficulty: "gentle", date: "2026-09-13", accent: "mint" },
];

const demoChallengeAssignments: Record<string, Challenge> = {
  [demoProfiles[0].id]: todaysChallenges[0],
  [demoProfiles[1].id]: todaysChallenges[1],
  [demoProfiles[2].id]: todaysChallenges[2],
  [demoProfiles[3].id]: todaysChallenges[3],
};

export function getDailyChallengeForUser(userId: string) {
  const assignedDemoChallenge = demoChallengeAssignments[userId];
  if (assignedDemoChallenge) return assignedDemoChallenge;

  let hash = 0;
  for (const character of userId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return todaysChallenges[hash % todaysChallenges.length];
}

export const demoPosts: Post[] = [
  { id: "post-1", creator: demoProfiles[0], challenge: getDailyChallengeForUser(demoProfiles[0].id), caption: "My commute has entered its main character era. #joy #dailyritual", mediaType: "photo", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80", posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80", likes: 248, comments: 18, liked: false, createdAt: "12 min ago" },
  { id: "post-2", creator: demoProfiles[1], challenge: getDailyChallengeForUser(demoProfiles[1].id), caption: "Proof that the grocery aisle can be a stage. @maya.moves #smallwins", mediaType: "photo", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80", posterUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80", likes: 91, comments: 7, liked: true, createdAt: "34 min ago" },
  { id: "post-3", creator: demoProfiles[2], challenge: getDailyChallengeForUser(demoProfiles[2].id), caption: "Took the long way home and found a whole new block. #outside #notice", mediaType: "photo", photoUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80", posterUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80", likes: 403, comments: 29, liked: false, createdAt: "1 hr ago" },
];

export const demoComments: Record<string, Comment[]> = {
  "post-1": [{ id: "comment-1", author: demoProfiles[2], body: "The tiny shoulder shimmy! 10/10.", createdAt: "8 min ago", likes: 12 }],
  "post-2": [{ id: "comment-2", author: demoProfiles[0], body: "The grocery aisle really is a stage when you commit to it.", createdAt: "25 min ago", likes: 8 }],
  "post-3": [{ id: "comment-3", author: demoProfiles[1], body: "This made me want to take the long way home too.", createdAt: "42 min ago", likes: 15 }],
};
