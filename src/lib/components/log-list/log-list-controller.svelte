<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import { getDerivedData } from '$lib/supabase/database';
	import type { Tables } from '$lib/supabase/types';
	import groupBy from 'just-group-by';
	import { onMount } from 'svelte';

	let { data, children, realtime = false } = $props();


	let timeline = $state(data.timeline);
	let shows: Tables<'shows'>[] = $state(data.shows);
	let groupedByYear = $derived(groupByYear(timeline, shows));

	$inspect(groupedByYear);

	function groupByYear(log: Tables<'log_entries'>[], shows: Tables<'shows'>[]) {
		const sorted = log.toSorted((a, b) => {
			if ((a.date ?? '0') > (b.date ?? '0')) {
				return -1;
			} else {
				return 1;
			}
		});
		const groupRecord = groupBy(sorted, (o) => (o.date ?? '').split('-')[0]);
		const groupedInArray = Object.entries(groupRecord).map(([key, data]) => {
			return {
				year: key,
				items: data.map((item) => {
					return {
						log_entry: item,
						show: shows.find((o) => o.id === item.show_id) ?? null
					};
				})
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

	async function getShows(timeline: Tables<'log_entries'>[]) {
		const { data, error } = await supabase
			.client!.from('shows')
			.select('*')
			.in(
				'id',
				timeline.map((o) => o.show_id)
			);
		return data ?? [];
	}

	function initSubscriptions() {
		if (!supabase.client) return;
		const userid = data.session?.user.id;
		supabase.client
			.channel('log-inserts')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'log_entries',
					filter: `user_id=eq.${userid}`
				},
				async (payload) => {
					console.log(payload);
					shows = await getShows([...timeline, payload.new]);
					timeline = [...timeline, payload.new];
				}
			)
			.subscribe();

		supabase.client
			.channel('log-updates')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'log_entries',
					filter: `user_id=eq.${userid}`
				},
				async (payload) => {
					if (timeline.find((o: Tables<'log_entries'>) => o.id === payload.new.id)) {
						console.log(payload);
						const item = timeline.find((o: Tables<'log_entries'>) => o.id === payload.new.id);
						const index = timeline.indexOf(item);
						timeline[index] = payload.new;
					}
				}
			)
			.subscribe();

		supabase.client
			.channel('log-deletes')
			.on(
				'postgres_changes',
				{
					event: 'DELETE',
					schema: 'public',
					table: 'log_entries'
				},
				async (payload) => {
					if (timeline.find((o: Tables<'log_entries'>) => o.id === payload.old.id)) {
						const item = timeline.find((o: Tables<'log_entries'>) => o.id === payload.old.id);
						const index = timeline.indexOf(item);
						timeline = timeline.toSpliced(index, 1);
					}
				}
			)
			.subscribe();
	}

	onMount(() => {
		if (realtime) {
			initSubscriptions();
		}
	});
</script>

<svelte:document
	onvisibilitychange={() => {
		if (!document.hidden && realtime) {
			initSubscriptions();
		}
	}}
/>

{@render children(groupedByYear)}
