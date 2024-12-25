import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params,
	locals: { supabase, safeGetSession },
	parent
}) => {
	const session = await safeGetSession();

	const profileRes = await supabase.from('profiles').select('*').eq('username', params.username);
	const profile = profileRes.data ? profileRes.data[0] : null;

	const followersRes = await supabase.from('follows').select('*').eq('follower', profile.id);
	const followers = followersRes.data ?? [];

	async function profiles() {
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.in(
				'id',
				followers.map((o) => o.following)
			);
		return data ?? [];
	}

	return {
		followerProfiles: profiles()
	};
};
