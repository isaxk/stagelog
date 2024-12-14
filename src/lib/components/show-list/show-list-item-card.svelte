<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { show } = $props();

	let creator: Tables<'profiles'> | null = $state(null);

	onMount(async () => {
		const { data, error } = await supabase
			.client!.from('profiles')
			.select('*')
			.eq('id', show.creator_id)
			.single();
		creator = data;
	});

	let imageLoaded = $state(false);
</script>

<a class="z-0 flex flex-grow min-w-0 gap-3 rounded bg-card p-3 text-left drop-shadow border border-border/80" href="/show/{show.id}">
	<div
		class="relative aspect-square min-h-20 min-w-20 overflow-hidden rounded bg-zinc-400 dark:bg-zinc-900 object-cover"
	>
		{#key show}
			<img
				src={show.image_url}
				onload={() => (imageLoaded = true)}
				in:fade={{ duration: 150 }}
				class="absolute h-full w-full object-cover rounded border-border border drop-shadow-md {imageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
				alt="Album"
			/>
		{/key}
	</div>
	<div class="flex h-20 w-full min-w-0 flex-grow flex-col">
		<div class="w-full overflow-x-hidden text-ellipsis text-nowrap font-serif text-2xl font-medium">
			{show.name}
		</div>
		<div class="text-md flex-grow">
			{show.playwright}
		</div>
		<div class="flex items-center pt-1">
			<div class="flex-grow">
				{#each show.tags as tag}
					<div
						class="w-max rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 drop-shadow-sm"
					>
						{tag}
					</div>
				{/each}
			</div>
			{#if creator}
				<div class="flex items-center gap-1">
					<img
						src={creator.avatar_url}
						class="aspect-square h-5 w-5 rounded-full object-cover"
						alt=""
					/>
					{creator.username}
				</div>
			{/if}
		</div>
	</div>
</a>
