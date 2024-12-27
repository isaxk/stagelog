<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { fade } from 'svelte/transition';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let {
		locations,
		onSelect
	}: {
		locations: Promise<Tables<'districts'>[]>;
		onSelect: (location: Tables<'districts'>) => void;
	} = $props();
</script>

<div class="flex w-full flex-col gap-2">
	{#await locations}
		{#each [1, 2, 3] as _}
			<Skeleton class="h-12 w-full {_}" />
		{/each}
	{:then locations}
		{#each locations.toSorted((a, b) => {
			if (a.featured) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			} else {
				return -1;
			}
		}) as location}
			<button
				in:fade={{ duration: 200 }}
				class="flex min-h-12 items-center rounded border border-border bg-card p-2 text-left drop-shadow-sm"
				onclick={() => onSelect(location)}
			>
				<div class="flex flex-col">
					<div class="font-medium">
						{location.name}
					</div>
					{#if location.name !== location.city && !location.tour}
						<div class="-mt-1 text-xs font-light">{location.city}</div>
					{/if}
				</div>

				<div class="flex-grow"></div>
				{#if location.tour}
					<div class="rounded-full bg-muted px-3 py-1 text-sm">TOUR</div>
				{/if}
				{#if location.featured}
					<div class="rounded-full bg-muted px-3 py-1 text-sm">FEATURED</div>
				{/if}
			</button>
		{/each}
	{/await}
</div>
