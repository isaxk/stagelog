<script lang="ts">
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { getDerivedData } from '$lib/supabase/database';
	import { groupByYear } from '$lib/utils/array';
	import { onMount } from 'svelte';

	let { data } = $props();

	let timeline = $state(data.timeline);
	let groupedByYear = $derived(groupByYear(timeline));
	let shows = $state(data.shows);
	let productions = $state(data.productions);

	onMount(() => {
		if (!supabase.client) return;
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
					const derived = await getDerivedData([...timeline, payload.new]);
					if (!derived) return;
					shows = derived.shows;
					productions = derived.productions;
					timeline = [...timeline, payload.new];
				}
			)
			.subscribe();
	});

</script>

<div class="flex h-20 sticky top-0 bg-zinc-50 z-20 items-center p-4 font-serif text-4xl font-medium lg:text-3xl">
	My Timeline
</div>
<div class="flex w-full flex-col gap-2">
	{#if timeline.length > 0 && shows.length > 0 && productions.length > 0}
		{#each groupedByYear as year, i (year.items)}
			<LogListYear {year}>
				{#each year.items as item, i (item.id)}
					<LogListItem {i} log={item} {shows} {productions} />
				{/each}
			</LogListYear>
		{/each}
	{/if}
</div>
