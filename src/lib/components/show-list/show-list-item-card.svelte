<script lang="ts">
	import { fade } from 'svelte/transition';

	let { show } = $props();

	let imageLoaded = $state(false);
</script>

<div class="z-0 flex w-full gap-3 rounded bg-card p-3 text-left drop-shadow-md">
	<div
		class="relative aspect-square h-20 min-w-20 overflow-hidden rounded bg-zinc-400 object-cover"
	>
		{#key show}
			<img
				src={show.image_url}
				onload={() => (imageLoaded = true)}
				in:fade={{ duration: 200 }}
				class="absolute h-full w-full object-cover drop-shadow-md {imageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
				alt="Album"
			/>
		{/key}
	</div>
	<div class="flex h-full w-full min-w-0 flex-grow flex-col">
		<div class="w-full overflow-x-hidden text-ellipsis text-nowrap font-serif text-2xl font-medium">
			{show.name}
		</div>
		<div class="text-md flex-grow">
			{show.playwright}
		</div>
		<div class="flex items-center pt-1">
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
