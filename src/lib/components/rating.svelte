<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	let { value = $bindable(0), small = false } = $props();

	let hovered = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex {small?'':'h-10'} items-center text-amber-500"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	{#each Array(hovered||!small ? 5 : value), i (i)}
		<button onclick={() => (value = i+1)} in:fade={{duration:300}} animate:flip={{duration:350}}
			><Star
				size={small ? 16 : 30}
				strokeWidth={2}
				fill={value > i ? '#f59e0b' : 'transparent'}
			/>
		</button>
	{/each}
</div>
