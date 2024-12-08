<script lang="ts">

	let { show } = $props();
</script>

<div class="z-0 flex h-28 w-full gap-3 rounded bg-white p-3 text-left drop-shadow-md">
	<img
		src={show.image_url}
		class="aspect-square h-full rounded object-cover drop-shadow-md"
		alt="Album"
	/>
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
