import type { Tables } from '$lib/types/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	let timeline: Tables<'log_entries'>[] | null = null;

	async function loadTimeline() {
		const { data, error } = await supabase
			.from('log_entries')
			.select('*')
			.eq('user_id', session?.user.id);
		timeline = data ?? [];
		return data ?? [];
	}

	async function loadShows() {
		const { data, error } = await supabase
			.from('shows')
			.select('*')
			.in(
				'id',
				timeline!.map((o) => o.show_id)
			);
		return data ?? [];
	}

	return {
		timeline: await loadTimeline(),
		shows: loadShows()
	};
};
