<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { sticky } from '$lib/utils/stuck';

	let isStuck = $state(false);

	function handleStuck(e: boolean) {
		isStuck = e;
	}

	let { children, year, sticky: isSticky = false } = $props();
</script>

<div class="-mb-ios-top flex w-full flex-col gap-0 bg-gradient-to-b to-zinc-50 pb-8">
	<div class={['-top-1 left-0 right-0 w-full', isSticky && 'sticky z-20']}>
		<div
			class={[
				'bg-background pt-ios-top transition-all duration-200',
				isStuck && 'border-b border-border drop-shadow lg:drop-shadow-none'
			]}
			use:sticky={handleStuck}
		>
			<div class={['flex w-full items-center gap-3 px-4 py-1 pb-2']}>
				<div
					class={[
						'text-center text-lg transition-all duration-200 ease-in-out lg:text-left',
						isStuck ? 'w-full font-semibold' : 'w-10 font-medium'
					]}
				>
					{year.year}
				</div>
				{#if !isStuck}
					<div
						in:fly={{ duration: 200, y: 10 }}
						out:fly={{ duration: 200, y: 10 }}
						class={['h-[1px] flex-grow bg-border drop-shadow-sm transition-all']}
					></div>
				{/if}
			</div>
		</div>
	</div>
	<div class="flex w-full flex-col gap-3 p-4">
		{@render children()}
	</div>
</div>
