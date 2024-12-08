<script lang="ts">
	import { cn } from '$lib/utils';

	let { onclick, children, class: className = '' } = $props();
</script>

<button
	{onclick}
	class={cn(
		'flex w-full px-10 justify-center gap-2 rounded border border-blue-500 py-2 text-blue-500 transition-all hover:bg-blue-100',
		className
	)}>{@render children()}</button
>
