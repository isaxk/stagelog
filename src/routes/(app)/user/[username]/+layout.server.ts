import { supabase } from '$lib/supabase/client.svelte';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const username = params.username;
	const session = await safeGetSession();

	const { data, error } = await supabase.from('profiles').select('*').eq('username', username);
	const profile = data ? data[0] : null;

	const timelineRes = await supabase.from('log_entries').select('*').eq('user_id', profile?.id);

	const timeline = timelineRes.data ?? [];

	async function getShows() {
		const showsResponse = await supabase
			.from('shows')
			.select('*')
			.in(
				'id',
				timeline.map((o) => o.show_id)
			)
			.eq('in_review', false);
		return showsResponse.data ?? [];
	}

	const followersRes = await supabase.from('follows').select('*').eq('following', profile?.id);
	const followingRes = await supabase.from('follows').select('*').eq('follower', profile?.id);
	const followers = followersRes.data ?? [];
	const following = followingRes.data ?? [];

	const isUserFollowing = followers.find((o) => o.follower === session.user.id) !== null;

	return {
		profile,
		timeline,
		shows: getShows(),
		followers,
		following,
		isUserFollowing
	};
};
