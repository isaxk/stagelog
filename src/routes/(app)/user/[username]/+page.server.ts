import { supabase } from '$lib/supabase/client.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const username = params.username;

	const { data, error } = await supabase.from('profiles').select('*').eq('username', username);
    console.log(data, error);
	const profile = data ? data[0] : null;

	const timelineRes = await supabase.from('log_entries').select('*').eq('user_id', profile.id);
	const timeline = timelineRes.data ?? [];

	const productionsRes = await supabase
		.from('productions')
		.select('*')
		.in(
			'id',
			timeline.map((o) => o.production_id)
		);
	const productions = productionsRes.data ?? [];

	const showsRes = await supabase
		.from('shows')
		.select('*')
		.in(
			'id',
			productions.map((o) => o.show)
		);
	const shows = showsRes.data ?? [];
	return {
		profile,
		timeline,
		productions,
		shows
	};
};
