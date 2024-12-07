<script lang="ts">
	let { onclick, children } = $props();
</script>

<button
	{onclick}
	class="flex w-full justify-center gap-2 rounded border border-blue-500 py-2 text-blue-500 transition-all hover:bg-blue-100"
	>{@render children()}</button
>
