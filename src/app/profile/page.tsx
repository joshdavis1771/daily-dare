import { AppShell } from "@/components/app-shell";
import { ProfileView } from "@/components/profile-view";
import { demoPosts, demoProfiles } from "@/lib/demo-data";

export default async function ProfilePage({
	searchParams,
}: {
	searchParams: Promise<{ post?: string | string[] }>;
}) {
	const params = await searchParams;
	const postId = typeof params.post === "string" ? params.post : undefined;
	const posts = demoPosts.filter(
		(post) =>
			post.creator.id === demoProfiles[0].id ||
			post.creator.id === demoProfiles[1].id,
	);

	return (
		<AppShell>
			<ProfileView
				editable
				profile={demoProfiles[0]}
				posts={posts}
				initialPostId={postId}
			/>
		</AppShell>
	);
}
