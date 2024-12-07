import type { Tables } from '$lib/supabase/types';
import groupBy from 'just-group-by';

export function groupByYear(log: Tables<'log_entries'>[]) {
	const sorted = log.toSorted((a, b) => {
		if ((a.date ?? '0') > (b.date ?? '0')) {
			return -1;
		} else {
			return 1;
		}
	});
	const groupRecord = groupBy(sorted, (o) => (o.date??'').split('-')[0]);
	const groupedInArray = Object.entries(groupRecord).map(([key, data]) => {
		return {
			year: key,
			items: data
		};
	});
	return groupedInArray.toSorted((a, b) => {
		if (a.year > b.year) {
			return -1;
		} else {
			return 1;
		}
	});
}
