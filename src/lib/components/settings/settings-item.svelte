<script lang="ts">
	let { label, children } = $props();
</script>

<div class="flex max-w-lg">
	<div class="flex-grow">{label}</div>
	<div>{@render children()}</div>
</div>
