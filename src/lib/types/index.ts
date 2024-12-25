import type { Tables } from '$lib/supabase/types';

export type YearGroup = {
	year: string;
	items: {
		show: Promise<Tables<'shows'>>;
		log_entry: Tables<'log_entries'>;
	}[];
};
