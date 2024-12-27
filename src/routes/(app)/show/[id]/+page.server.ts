import type { Tables } from '$lib/types/supabase';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { data, error } = await supabase.from('shows').select('*').eq('id', params.id).single();
	const profileRes = await supabase.from('profiles').select('*').eq('id', data.creator_id).single();
	const profile = profileRes.data ?? null;

	const logResponse = await supabase
		.from('log_entries')
		.select('*')
		.eq('show_id', params.id)
		.order('date', { ascending: false });
	const logs = logResponse.data ?? [];

	console.log(logs.map((o: Tables<'log_entries'>) => o.user_id));
	const profilesRes = await supabase
		.from('profiles')
		.select('*')
		.in(
			'id',
			logs.map((o: Tables<'log_entries'>) => o.user_id)
		);
	const profiles = profilesRes.data ?? [];

	return {
		show: data,
		profile,
		logs,
		profiles
	};
};
