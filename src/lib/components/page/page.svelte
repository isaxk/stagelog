<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { Overlay } from '../ui/dialog';

	let { children, title } = $props();
</script>

<div class="flex h-20 items-center bg-background p-4 font-serif text-4xl font-medium lg:text-3xl">
	<div class="flex-grow">{title}</div>
</div>

<div class="p-4">
	{@render children()}
</div>
