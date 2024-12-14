<script lang="ts">
	import { beforeNavigate, goto, onNavigate } from '$app/navigation';
	import CustomButton from '$lib/components/custom-button.svelte';
	import ShowListItemWrapper from '$lib/components/show-list/add-to-timeline.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { debounce } from '$lib/utils/time';
	import { Heart, List } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Drawer } from 'vaul-svelte';
	import { toast } from 'svelte-sonner';
	import Page from '$lib/components/page/page.svelte';
	import AddToTimeline from '$lib/components/show-list/add-to-timeline.svelte';
	import ShowListItemCard from '$lib/components/show-list/show-list-item-card.svelte';

	let { data } = $props();

	const { supabase, mobile } = data;

	let query = $state('');
	let featured: Tables<'shows'>[] = $state(data.featured);
	let showingFeatured = $state(true);
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
		if (query.length < 1) {
			results = featured;
			showingFeatured = true;
		} else {
			const res = await supabase
				.from('shows')
				.select('*')
				.textSearch('name', query, {
					type: 'phrase'
				})
				.or(`in_review.eq.false, creator_id.eq.${data.session?.user.id}`);
			results = res.data ?? [];
			showingFeatured = false;
		}
	});

	async function handleTimeline(item: any) {
		const { data, error } = await supabase.from('log_entries').insert([item]).select('*');
		return true;
	}
</script>

<svelte:head>
	{#if !mobile}
		<title>Find Shows - StageLog</title>
	{/if}
</svelte:head>

<Page title="Find Shows">
	<input
		type="text"
		onkeydown={search}
		bind:value={query}
		class="w-full rounded border bg-card p-3 outline-none -outline-offset-1 drop-shadow transition-all focus:outline-blue-500"
		placeholder="Search for shows..."
	/>
	<div class="flex min-h-0 flex-grow flex-col gap-2 overflow-y-scroll py-4">
		{#if results.length > 0}
			{#if showingFeatured}
				<div class="text-lg font-medium">Featured:</div>
			{/if}
			{#each results as result, i (result.id)}
				<div class="flex gap-3 w-full">
					<AddToTimeline {mobile} show={result} />
					<ShowListItemCard show={result} />
				</div>
			{/each}
		{/if}
		<p class="py-2 text-sm">
			Can't find the show you're looking for? <a
				href="/contribute"
				class="text-blue-500 hover:underline">Add it yourself</a
			>
		</p>
	</div>
</Page>
