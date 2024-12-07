import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { data, error } = await supabase
		.from('log_entries')
		.select('*')
		.eq('user_id', session?.user.id);
	const timeline = data ?? [];

	const productionsResponse = await supabase
		.from('productions')
		.select('*')
		.in(
			'id',
			timeline.map((o) => o.production_id)
		);
	const productions = productionsResponse.data ?? [];
	const showsResponse = await supabase
		.from('shows')
		.select('*')
		.in(
			'id',
			productions.map((o) => o.show)
		);
	const shows = showsResponse.data ?? [];

	return {
		timeline,
		shows,
		productions
	};
};
