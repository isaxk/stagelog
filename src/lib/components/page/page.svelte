<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { Overlay } from '../ui/dialog';
	import { scrollY } from 'svelte/reactivity/window';

	let { children, title } = $props();
</script>

<div
	class="sticky top-0 z-50 flex min-h-20 items-end bg-background px-4 py-4 pt-ios-top font-medium transition-all duration-300 {(scrollY.current ??
		0) > 10
		? 'border-b border-border drop-shadow-md sm:drop-shadow-none'
		: ''}"
>
	<div
		class={[
			'text-nowrap pt-2 text-center transition-all duration-300 ease-in-out',
			(scrollY.current ?? 0) > 10
				? 'w-full font-sans text-xl lg:w-10 lg:font-serif lg:text-3xl'
				: 'w-10 font-serif text-4xl lg:text-3xl'
		]}
	>
		{title}
	</div>
</div>

<div class="p-4">
	{@render children()}
</div>
