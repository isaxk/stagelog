<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	let {
		value = $bindable(0),
		small = false,
		profile = false,
		onchange = (v: number) => {}
	}: {
		value: number | null;
		small: boolean;
		profile: boolean;
		onchange?: (v: number) => void;
	} = $props();

	let hovered = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if value}
	<div
		class="flex {small ? '' : 'h-10'} items-center text-amber-500"
		onmouseenter={() => (hovered = !profile)}
		onmouseleave={() => (hovered = false)}
	>
		{#each Array((hovered || !small) && !profile ? 5 : value), i (i)}
			<button
				onclick={() => {
					if (profile) return;
					value = i + 1;
					onchange(value);
				}}
				in:fade={{ duration: 300 }}
				animate:flip={{ duration: 350 }}
				><Star
					size={small ? 16 : 30}
					strokeWidth={2}
					fill={value > i ? '#f59e0b' : 'transparent'}
				/>
			</button>
		{/each}
	</div>
{/if}
