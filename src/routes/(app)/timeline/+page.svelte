<script lang="ts">
	import InstallBanner from '$lib/components/layout/install-banner.svelte';
	import LogListController from '$lib/components/log-list/log-list-controller.svelte';
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import Page from '$lib/components/page/page.svelte';
	import type { YearGroup } from '$lib/types/index.js';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { crossfade } from 'svelte/transition';

	let { data } = $props();

</script>


<svelte:head>
	<title>Timeline - StageLog</title>
</svelte:head>

<Page title="Timeline">
	<InstallBanner />
	<div class="flex w-full flex-col gap-2">
		<LogListController {data} realtime>
			{#snippet children(groupedByYear: YearGroup[])}
				{#if groupedByYear.length > 0}
					{#each groupedByYear as year, i (year.year)}
						<LogListYear {year}>
							{#each year.items as item, i (item.log_entry.id)}
								<div
									in:fly={{ duration: 200 }}
									out:fade={{ duration: 200 }}
									animate:flip={{ duration: 200 }}
								>
									<LogListItem {i} {item} profile={null} />
								</div>
							{/each}
						</LogListYear>
					{/each}
				{:else}
				<div class="text-lg">Looks like you have no shows listed. <a href="/log" class="text-blue-500 hover:underline">Add them here</a></div>
				{/if}
			{/snippet}
		</LogListController>
	</div>
</Page>
