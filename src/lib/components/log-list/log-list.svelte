<script lang="ts">
	import LogListYear from "./log-list-year.svelte";
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount, tick } from 'svelte';
	import LogListItem from './log-list-item.svelte';
	import { fade, fly } from 'svelte/transition';
	import { groupByYear } from '$lib/utils/array';

	let log: any[] = $state([]);
	let productions: any[] = $state([]);
	let shows: any[] = $state([]);
	let theatres: any[] = $state([]);

	const groupedByYear = $derived(groupByYear(log));


	async function updateDerivedData(logs: any[]) {
		if(!supabase.client) return;
		const productionsResponse = await supabase.client
			.from('productions')
			.select('*')
			.in(
				'id',
				logs.map((o) => o.production_id)
			);
		productions = productionsResponse.data ?? [];
		const showsResponse = await supabase.client
			.from('shows')
			.select('*')
			.in(
				'id',
				productions.map((o) => o.show)
			);
		shows = showsResponse.data ?? [];
	}

	onMount(async () => {
		if(!supabase.client) return;
		const { data, error } = await supabase.client
			.from('log_entries')
			.select('*')
			.eq('user_id', supabase.user?.id);
		log = data ?? [];
		updateDerivedData(log);
		supabase.client
			.channel('log-updates')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'log_entries'
				},
				async (payload) => {
					await updateDerivedData([...log, payload.new]);
					log = [...log, payload.new];
					
				}
			)
			.subscribe();
	});
</script>

<div class="flex flex-col gap-2 w-full">
	{#if productions.length > 0 && shows.length > 0}
		<div in:fade={{ duration: 200 }}>
			{#each groupedByYear as year, i (year.items)}
				<LogListYear {year}>
					{#each year.items as item, i (item.id)}
						<LogListItem {i} log={item} {shows} {productions} />
					{/each}
				</LogListYear>
			{/each}
		</div>
	{/if}
</div>

