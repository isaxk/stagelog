<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { show } = $props();

	let imageLoaded = $state(false);
</script>

<a
	class="z-0 flex min-w-0 flex-grow gap-3 overflow-hidden rounded border border-border/80 bg-card text-left drop-shadow"
	href="/show/{show.id}"
>
	<div class="aspect-square w-24 min-w-24 overflow-hidden bg-zinc-400 dark:bg-zinc-900">
		<img
			src={show.image_url}
			onload={() => (imageLoaded = true)}
			in:fade={{ duration: 150 }}
			class="h-full w-full border-r border-border object-cover drop-shadow-md {imageLoaded
				? 'opacity-100'
				: 'opacity-0'}"
			alt="Album"
		/>
	</div>
	<div class="flex w-full min-w-0 flex-grow flex-col py-2 pr-2">
		<div class="w-full overflow-hidden text-ellipsis text-nowrap font-serif text-2xl font-medium">
			{show.name}
		</div>
		<div class="text-md flex-grow -mt-0.5">
			{show.playwright}
		</div>
		<div class="flex items-center">
			<div class="flex-grow">
				{#each show.tags as tag}
					<div
						class="w-max rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 drop-shadow-sm"
					>
						{tag}
					</div>
				{/each}
			</div>
		</div>
	</div>
</a>
