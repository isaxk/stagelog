<script lang="ts">
	import InstallBanner from '$lib/components/layout/install-banner.svelte';
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import Page from '$lib/components/page/page.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import type { Tables } from '$lib/types/supabase';
	import type { YearGroup } from '$lib/types/index';
	import { groupByYear } from '$lib/utils/array';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let timeline: YearGroup[] = $state(groupByYear(data.timeline, data.shows));
	$inspect(timeline);

	async function handleUpdate(id: number, newVal: Tables<'log_entries'>) {
		const { data: res, error } = await supabase
			.client!.from('log_entries')
			.update({ ...newVal })
			.eq('id', id)
			.select('*');
		console.log(error);
		const existing = data.timeline.findIndex((i) => i.id === id);
		console.log(existing);
		data.timeline[existing] = { ...data.timeline[existing], ...newVal };
		timeline = groupByYear(data.timeline, data.shows);
	}

	async function handleDelete(id: number) {
		await supabase.client!.from('log_entries').delete().eq('id', id);
		const existing = data.timeline.findIndex((i) => i.id === id);
		data.timeline.splice(existing, 1);
		console.log(data.timeline);
		timeline = groupByYear(data.timeline, data.shows);
	}
</script>

<svelte:head>
	<title>Timeline - StageLog</title>
</svelte:head>

<Page title="Timeline">
	<InstallBanner />
	<div class="flex w-full flex-col gap-2">
		<!-- <LogListController timeline={data.timeline} shows={data.shows} session={data.session} realtime>
			{#snippet children(groupedByYear: YearGroup[])}
				{#if groupedByYear.length > 0}
					{#each groupedByYear as year, i (year.year)}
						<LogListYear {year}>
							{#each year.items as item, i (item.log_entry.id)}
								<div
									in:fade={{ duration: 200 }}
									out:fade={{ duration: 200 }}
									animate:flip={{ duration: 200 }}
								>
									<LogListItem {i} {item} profile={null} />
								</div>
							{/each}
						</LogListYear>
					{/each}
				{:else}
					<div class="text-lg">
						Looks like you have no shows listed. <a
							href="/log"
							class="text-blue-500 hover:underline">Add them here</a
						>
					</div>
				{/if}
			{/snippet}
		</LogListController> -->
		{#each timeline as year, i (year.year)}
			<LogListYear {year}>
				{#each year.items as item, i (item.log_entry.id)}
					<div
						class={cn('h-[72px] min-h-[72px]', {
							'h-[105px] lg:h-[72px]': item.log_entry.comments,
							'h-[100px] lg:h-[72px]': !item.log_entry.comments
						})}
						animate:flip={{ duration: 200 }}
					>
						<LogListItem
							{i}
							{item}
							profile={null}
							onUpdate={handleUpdate}
							onDelete={handleDelete}
						/>
					</div>
				{/each}
			</LogListYear>
		{/each}
	</div>
</Page>
