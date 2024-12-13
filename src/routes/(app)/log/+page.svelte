<script lang="ts">
	import { beforeNavigate, goto, onNavigate } from '$app/navigation';
	import CustomButton from '$lib/components/custom-button.svelte';
	import ShowListItemWrapper from '$lib/components/show-list/show-list-item-wrapper.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { debounce } from '$lib/utils/time';
	import { Heart, List } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Drawer } from 'vaul-svelte';

	let { data } = $props();

	const { supabase, mobile } = data;

	let query = $state('');
	let featured: Tables<'shows'>[] = $state(data.featured);
	let results: Tables<'shows'>[] = $state(featured);

	type SelectedItem = {
		location: string;
		show_id: number;
		rating: number;
		comments: string;
		date: string;
	};

	let selectedItems: SelectedItem[] = $state([]);
	let subNav = false;

	const search = debounce(async () => {
		const { data, error } = await supabase
			.from('shows')
			.select('*')
			.textSearch('name', query, {
				type: 'phrase'
			})
			.eq('in_review', false);
		results = data ?? [];
	});

	async function handleTimeline() {
		const { data, error } = await supabase
			.from('log_entries')
			.insert([...selectedItems])
			.select('*');
		subNav = true;
		if (!mobile) goto('/timeline');
		return true;
	}

	beforeNavigate(({ cancel }) => {
		if (selectedItems.length > 0 && !subNav) {
			if (
				!confirm(
					"You have not yet added you're selected shows. Do you still want to leave this page?"
				)
			) {
				cancel();
			}
		}
	});
</script>

<svelte:head>
	{#if !mobile}
		<title>Log Shows - StageLog</title>
	{/if}
</svelte:head>

{#if mobile}
	<div class="z-10 flex h-16 items-center justify-center rounded-t-lg bg-zinc-100 p-4 drop-shadow">
		<div class="flex w-full max-w-screen-sm items-center">
			<div class="w-40"></div>
			<div class="flex-grow text-center font-semibold">Log {selectedItems.length} Shows</div>
			<Drawer.Close class="w-40 pr-1 text-right text-blue-500">Cancel</Drawer.Close>
		</div>
	</div>
{:else}
	<div class="sticky top-0 z-20 flex h-24 w-full items-center bg-background p-4">
		<div class="flex flex-grow flex-col">
			<div class="font-serif text-4xl font-medium lg:text-3xl">Log Shows</div>
			<div class="flex gap-2">
				<div>{selectedItems.length} selected</div>
				<button onclick={() => (selectedItems = [])} class="text-blue-500">Clear</button>
			</div>
		</div>

		{#if !mobile && selectedItems.length > 0}
			<div class="text flex h-20 min-w-96 items-center gap-4 text-center">
				<CustomButton onclick={handleTimeline}
					><List />
					<div>Add to timeline</div></CustomButton
				>
			</div>
		{/if}
	</div>
{/if}

<div class="flex w-full flex-grow flex-col px-4 py-2 {!mobile ? 'min-h-0' : 'min-h-0'}">
	<input
		type="text"
		onkeydown={search}
		bind:value={query}
		class="w-full rounded border p-3 bg-card drop-shadow transition-all outline-none focus:outline-blue-500 -outline-offset-1"
		placeholder="Search for shows..."
	/>
	<div class="flex min-h-0 flex-grow flex-col gap-2 overflow-y-scroll py-4">
		{#if results.length > 0}
			{#if query.length < 1}
				<div class="text-lg font-medium">Featured:</div>
			{/if}
			{#each results as result}
				<ShowListItemWrapper
					{mobile}
					show={result}
					onsubmit={(e: SelectedItem) => {
						console.log(e);
						selectedItems.push(e);
						query = '';
						setTimeout(() => (results = featured), 250);
					}}
				/>
			{/each}
			<p class="py-2 text-sm">
				Can't find the show you're looking for? <a
					href="/contribute"
					class="text-blue-500 hover:underline">Add it yourself</a
				>
			</p>
		{/if}
	</div>
</div>

{#if mobile && selectedItems.length > 0}
	<div class="text flex h-20 items-center bg-card text-center drop-shadow-xl">
		<Drawer.Close
			class="flex w-full flex-col items-center justify-center font-medium text-blue-600"
			onclick={handleTimeline}
		>
			<List />
			<div>Add to timeline</div>
		</Drawer.Close>
	</div>
{/if}
