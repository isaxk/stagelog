<script lang="ts">
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import { groupByYear } from '$lib/utils/array.js';
	import { fade } from 'svelte/transition';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();

	const groupedByYear = groupByYear(data.timeline);
</script>

<div class="max-w-screen-md w-full">


<div class="relative h-52 w-full" in:fade={{ duration: 200 }}>
	<div class="h-32 bg-blue-200"></div>
	<div class="absolute left-0 right-0 top-20 flex justify-center">
		<div class="flex w-full max-w-screen-md gap-4 px-4">
			<img src={data.profile?.avatar_url} alt="" class="w-28 rounded-full drop-shadow-md" />
		</div>
	</div>
</div>
<div class="px-4">
	<div class="flex flex-col justify-end pb-4 text-4xl font-semibold">
		{data.profile?.username}
	</div>
</div>
<div class="p-4">
	<Tabs.Root value="timeline" class="">
		<Tabs.List class="drop-shadow-sm w-full mb-4">
			<Tabs.Trigger value="timeline" class="drop-shadow-xs data-[state=active]:bg-white w-full"
				>Timeline</Tabs.Trigger
			>
			<Tabs.Trigger value="wishlist" class="drop-shadow-xs data-[state=active]:bg-white w-full"
				>Wishlist</Tabs.Trigger
			>
		</Tabs.List>
		<div class="border border-border rounded-md pb-4 bg-zinc-50 min-h-96">
			<Tabs.Content value="timeline" class="">
				{#each groupedByYear as year, i (year.items)}
					<div
						class="flex flex-col gap-2 bg-gradient-to-b to-zinc-50 p-4"
					>
						<div class="flex items-center gap-2">
							<div class="text-lg font-medium">{year.year}</div>
							<div class="h-0.5 flex-grow bg-border"></div>
						</div>
						{#each year.items as item, i (item.id)}
							<LogListItem {i} log={item} shows={data.shows} productions={data.productions} />
						{/each}
					</div>
				{/each}
			</Tabs.Content>
			<Tabs.Content value="wishlist"></Tabs.Content>
		</div>
	</Tabs.Root>
</div>
</div>