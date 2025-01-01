<script lang="ts">
	import { flip } from 'svelte/animate';
	import { groupByYear } from '$lib/utils/array';
	import { cn } from '$lib/utils';
	import { supabase } from '$lib/supabase/client.svelte';

	import InstallBanner from '$lib/components/layout/install-banner.svelte';
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import Page from '$lib/components/page/page.svelte';

	import type { Tables } from '$lib/types/supabase';
	import type { YearGroup } from '$lib/types/index';

	let { data } = $props();

	let timeline: YearGroup[] = $state(groupByYear(data.timeline, data.shows));

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

<div class="flex min-h-20 items-center px-4 pt-ios-top font-serif text-4xl font-medium lg:text-3xl">
	<div class="pt-2">Timeline</div>
</div>

<div class="flex w-screen flex-col gap-2 lg:w-full">
	{#each timeline as year, i (year.year)}
		<LogListYear {year} sticky>
			{#each year.items as item, i (item.log_entry.id)}
				<div
					class={cn('h-[72px] min-h-[72px]', {
						'h-[105px] lg:h-[72px]': item.log_entry.comments,
						'h-[100px] lg:h-[72px]': !item.log_entry.comments
					})}
					animate:flip={{ duration: 200 }}
				>
					<LogListItem {i} {item} profile={null} onUpdate={handleUpdate} onDelete={handleDelete} />
				</div>
			{/each}
		</LogListYear>
	{/each}
</div>
