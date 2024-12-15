<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { Overlay } from '../ui/dialog';
	import { scrollY } from 'svelte/reactivity/window';

	let { children, title } = $props();
</script>

<div class="sticky top-0 z-50 flex min-h-20 items-center pt-ios-top bg-background p-4 font-serif text-4xl font-medium lg:text-3xl transition-all {(scrollY.current ?? 0) > 50 ? 'drop-shadow-md border-b border-border':''}">
	<div class="flex-grow">{title}</div>
</div>

<div class="p-4">
	{@render children()}
</div>


