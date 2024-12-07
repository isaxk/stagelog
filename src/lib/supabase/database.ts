import { supabase } from './client.svelte';
import type { Tables } from './types';

export async function getDerivedData(timeline: Tables<'log_entries'>[]) {
	return new Promise<{
		productions: Tables<'productions'>[],
		shows: Tables<'shows'>[]
	}|null>(async (resolve) => {
		if (!supabase.client) {
			resolve(null);
			return;
		}
		const productionsResponse = await supabase.client
			.from('productions')
			.select('*')
			.in(
				'id',
				timeline.map((o) => o.production_id)
			);
		const productions = productionsResponse.data ?? [];
		const showsResponse = await supabase.client
			.from('shows')
			.select('*')
			.in(
				'id',
				productions.map((o) => o.show)
			);
		const shows = showsResponse.data ?? [];

		resolve({ shows, productions });
		return {
			productions,
			shows
		};
	});
}
