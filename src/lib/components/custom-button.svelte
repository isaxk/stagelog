<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { onclick, children, class: className = '', type='button' }:{
		onclick: ()=>void,
		children: Snippet,
		class?: string,
		type?: 'button'|'submit'
	} = $props();
</script>

<button
	{type}
	{onclick}
	class={cn(
		'flex w-full px-10 drop-shadow-md bg-zinc-50 justify-center gap-2 rounded border border-blue-500 py-2 text-blue-500 transition-all hover:bg-blue-100',
		className
	)}>{@render children()}</button
>
