<script lang="ts">
	import { preloadData } from '$app/navigation';
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { getDerivedData } from '$lib/supabase/database';
	import { groupByYear } from '$lib/utils/array';
	import { SquarePen } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { Drawer } from 'vaul-svelte';
	import AddShows from '../add/+page.svelte';

	let { data } = $props();

	let timeline = $state(data.timeline);
	let groupedByYear = $derived(groupByYear(timeline));
	let shows = $state(data.shows);
	let productions = $state(data.productions);

	let preloadedData: any = $state(null);

	function preloadDrawerData() {
		preloadData('/add').then((result) => {
			if (result.type === 'loaded') {
				preloadedData = result.data;
			}
		});
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
					const derived = await getDerivedData([...timeline, payload.new]);
					console.log(derived);
					if (!derived) return;
					shows = derived.shows;
					productions = derived.productions;
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
					if (timeline.find((o) => o.id === payload.new.id)) {
						console.log(payload);
						const item = timeline.find((o) => o.id === payload.new.id);
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
					if (timeline.find((o) => o.id === payload.old.id)) {
						const item = timeline.find((o) => o.id === payload.old.id);
						const index = timeline.indexOf(item);
						timeline = timeline.toSpliced(index, 1);
					}
				}
			)
			.subscribe();
	}

	onMount(initSubscriptions);

	onDestroy(() => {
		supabase.client?.removeAllChannels();
	});

	$inspect(timeline);
</script>


<svelte:document
	onvisibilitychange={() => {
		if (!document.hidden) {
			initSubscriptions();
		}
	}}
/>


<svelte:head>
	<title>Timeline - StageLog</title>
</svelte:head>

<div
	class="sticky top-0 z-20 flex h-20 items-center bg-zinc-50 p-4 font-serif text-4xl font-medium lg:text-3xl"
>
	<div class="flex-grow">My Log</div>
	<Drawer.Root
		shouldScaleBackground
		onOpenChange={(e) => {
			if (e === true) preloadDrawerData();
		}}
	>
		<Drawer.Trigger
			class="fixed bottom-20 right-4 flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-border bg-zinc-50 px-2 py-2 text-center text-xs drop-shadow-xl lg:hidden"
			><SquarePen size={26} /></Drawer.Trigger
		>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/80" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 flex h-[95%] flex-col rounded rounded-t-lg bg-zinc-50 outline-none"
			>
				{#if preloadedData}
					<AddShows data={{ ...preloadedData, mobile: true }} />
				{/if}
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
</div>
<div class="flex w-full flex-col gap-2">
	{#if timeline.length > 0 && shows.length > 0 && productions.length > 0}
		{#each groupedByYear as year, i (year.year)}
			<LogListYear {year}>
				{#each year.items as item, i (item.id)}
					<div
						in:fly={{ duration: 200 }}
						out:fade={{ duration: 200 }}
						animate:flip={{ duration: 200 }}
					>
						<LogListItem {i} log={item} {shows} {productions} profile={null} />
					</div>
				{/each}
			</LogListYear>
		{/each}
	{/if}
</div>
