<script lang="ts">
	import { Check, Clock, X } from 'lucide-svelte';

	let { name, img, status = 'pending' } = $props();
</script>

<div class="flex items-center gap-2 rounded-md bg-card p-2 drop-shadow">
	<img src={img} alt="Musical Art" class="h-10 w-10 rounded object-cover" />
	<div class="flex-grow font-serif text-xl font-medium">{name}</div>
	{#if status === 'approved'}
		<div class="flex items-center gap-1 rounded-full bg-green-200 px-3 py-1 text-sm">
			<Check size={14} /> Approved
		</div>
	{:else if status === 'rejected'}
		<div class="flex items-center gap-1 rounded-full bg-red-200 px-3 py-1 text-sm">
			<X size={14} /> Rejected
		</div>
	{:else}
		<div class="flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-sm">
			<Clock size={14} /> Pending
		</div>
	{/if}
</div>
