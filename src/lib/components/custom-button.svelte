<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		onclick,
		children,
		class: className = '',
		type = 'button'
	}: {
		onclick: () => void;
		children: Snippet;
		class?: string;
		type?: 'button' | 'submit';
	} = $props();
</script>

<button
	{type}
	{onclick}
	class={cn(
		'flex w-full justify-center gap-2 rounded border border-blue-500 bg-background px-10 py-2 text-blue-500 drop-shadow-md transition-all hover:bg-blue-100 dark:hover:bg-blue-950/70',
		className
	)}>{@render children()}</button
>
