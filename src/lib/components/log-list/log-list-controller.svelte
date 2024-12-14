<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import { getDerivedData } from '$lib/supabase/database';
	import type { Tables } from '$lib/supabase/types';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import groupBy from 'just-group-by';
	import { onDestroy, onMount } from 'svelte';

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

	async function initSubscriptions() {
		if (!supabase.client) return;
		const userid = data.session?.user.id;
		const logInserts = supabase.client
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

		const logUpdates = supabase.client
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

		const logDeletes = supabase.client
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
		

		return {
			logInserts,
			logUpdates,
			logDeletes
		};
	}

	let subs: {
		logInserts: RealtimeChannel;
		logUpdates: RealtimeChannel;
		logDeletes: RealtimeChannel;
	} | null = $state(null);

	$inspect(subs);

	onMount(() => {
		if (realtime) {
			initSubscriptions().then((e)=>{
				subs = e ?? null;
			})
			return () => {
				if (subs) {
					supabase.client!.removeChannel(subs?.logInserts);
					supabase.client!.removeChannel(subs?.logUpdates);
					supabase.client!.removeChannel(subs?.logDeletes);
				}
			};
		}
	});
</script>

<svelte:document
	onvisibilitychange={() => {
		if (!document.hidden && realtime) {
			initSubscriptions().then((e)=>{
				subs = e ?? null;
			})
		} else {
			if (subs) {
				supabase.client!.removeChannel(subs?.logInserts);
				supabase.client!.removeChannel(subs?.logUpdates);
				supabase.client!.removeChannel(subs?.logDeletes);
			}
		}
	}}
/>

{@render children(groupedByYear)}
