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
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let { data } = $props();

	const { supabase, mobile } = data;

	let query = $state('');
	let featured: Promise<Tables<'shows'>[]> = $state(data.featured);
	let showingFeatured = $state(true);
	let results: Tables<'shows'>[] = $state([]);
	featured.then((f) => (results = f));

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
			results = await featured;
			showingFeatured = true;
		} else {
			async function getResults() {
				const res = await supabase
					.from('shows')
					.select('*')
					.textSearch('name', query, {
						type: 'phrase'
					})
					.or(`in_review.eq.false, creator_id.eq.${data.session?.user.id}`);
				return res.data ?? [];
			}

			results = await getResults();
			showingFeatured = false;
		}
	}, 300);

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
		{#await featured}
			{#each { length: query.length > 2 ? 1 : 10 }}
				<div class="contents" in:fade={{ duration: 0, delay: 500 }}>
					<Skeleton class="h-[98px]" />
				</div>
			{/each}
		{:then}
			{#each results as result, i (result.id)}
				<div class="flex w-full gap-3" in:fade={{ duration: 200 }}>
					<AddToTimeline {mobile} show={result} />
					<ShowListItemCard show={result} />
				</div>
			{/each}
		{/await}
		<p class="py-2 text-sm">
			Can't find the show you're looking for? <a
				href="/contribute"
				class="text-blue-500 hover:underline">Add it yourself</a
			>
		</p>
	</div>
</Page>
