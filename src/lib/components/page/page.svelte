<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { Overlay } from '../ui/dialog';
	import { scrollY } from 'svelte/reactivity/window';
	import { crossfade } from 'svelte/transition';

	let { children, title } = $props();

	const [send, recieve] = crossfade({});
</script>

<div
	class="sticky top-0 z-50 flex min-h-20 w-full items-end px-4 py-4 pt-ios-top font-medium transition-all duration-300 {(scrollY.current ??
		0) > 10
		? 'border-b border-border bg-muted drop-shadow-md sm:drop-shadow-none'
		: 'bg-background'}"
>
	{#if (scrollY.current ?? 0) > 10}
		<div class="absolute inset-0 flex w-full items-center justify-center px-4">
			<div in:recieve={{ key: 'title' }} out:send={{ key: 'title' }} class={['font-sans text-xl']}>
				{title}
			</div>
		</div>
	{:else}
		<div class="absolute inset-0 flex w-full items-center justify-start px-4">
			<div
				in:recieve={{ key: 'title' }}
				out:send={{ key: 'title' }}
				class={['font-serif text-4xl']}
			>
				{title}
			</div>
		</div>
	{/if}
</div>

<div class="w-screen p-4 lg:w-full">
	{@render children()}
</div>
