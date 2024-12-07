<script lang="ts">
	import { fly } from "svelte/transition";
	import Rating from "../rating.svelte";

	let { i, log, shows, productions } = $props();

	const production = productions.filter((o) => o.id === log.production_id)[0];
	const show = shows.filter((o) => o.id === production.show)[0];
</script>

<div class="flex h-18 w-full items-center gap-4 pr-2" in:fly={{duration:200}}>
	<div class="flex w-12 justify-start gap-1">
		{#each log.date.split('-').splice(1, 2).toReversed() as date, i}
			<div class="">
				{date}
			</div>
			{#if i < 1}
				<div>/</div>
			{/if}
		{/each}
	</div>
	<div
		class="flex flex-grow min-w-0 items-center gap-2 rounded border border-border bg-white p-2 drop-shadow-md"
	>
		<img
			src={show.image_url}
			alt=""
			class="aspect-square w-14 rounded object-cover drop-shadow-md"
		/>
		<div class="flex-grow min-w-0">
			<div class="font-serif text-2xl font overflow-x-hidden text-nowrap text-ellipsis min-w-0 w-full">
				{show.name}
			</div>
			<div class="flex text-sm gap-1">
				<div class="font-light flex-grow">{production.district ?? production.tour_name}</div>
				<div class="pr-2 min-w-20 flex justify-end"><Rating value={log.rating} small/></div>
			</div>
		</div>
		
	</div>
</div>
