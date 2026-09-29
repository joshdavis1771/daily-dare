import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProfileView } from "@/components/profile-view";
import { demoPosts, demoProfiles } from "@/lib/demo-data";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const normalizedUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();
  const profile = demoProfiles.find((candidate) => candidate.username.toLowerCase() === normalizedUsername);
  if (!profile || profile.id === demoProfiles[0].id) notFound();
  return <AppShell><ProfileView profile={profile} posts={demoPosts.filter((post) => post.creator.id === profile.id)} /></AppShell>;
}