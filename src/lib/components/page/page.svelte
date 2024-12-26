<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { Overlay } from '../ui/dialog';
	import { scrollY } from 'svelte/reactivity/window';

	let { children, title } = $props();
</script>

<div
	class="sticky top-0 z-50 flex min-h-20 items-end bg-background px-4 py-4 pt-ios-top font-serif font-medium transition-all duration-300 lg:text-3xl {(scrollY.current ??
		0) > 50
		? 'border-b border-border text-3xl drop-shadow-md sm:drop-shadow-none'
		: 'text-4xl'}"
>
	<div class="flex-grow pt-2">{title}</div>
</div>

<div class="p-4">
	{@render children()}
</div>
