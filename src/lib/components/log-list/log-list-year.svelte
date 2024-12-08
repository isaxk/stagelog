<script lang="ts">
	let { children, year } = $props();
</script>

<div class="flex flex-col gap-2 bg-gradient-to-b to-zinc-50 p-4">
	<div class="flex items-center gap-2">
		<div class="text-lg font-medium">{year.year}</div>
		<div class="h-[1px] flex-grow bg-border drop-shadow-sm"></div>
	</div>
    {@render children()}
</div>
