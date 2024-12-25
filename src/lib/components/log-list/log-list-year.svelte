<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let { children, year } = $props();
</script>

<div class="flex flex-col gap-3 bg-gradient-to-b to-zinc-50 pb-8 lg:gap-3">
	<div class="flex items-center gap-2">
		<div class="text-lg font-medium">{year.year}</div>
		<div class="h-[1px] flex-grow bg-border drop-shadow-sm"></div>
	</div>
	<div class="flex flex-col gap-3">
		{@render children()}
	</div>
</div>
