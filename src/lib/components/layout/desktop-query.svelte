<script lang="ts">
	import { MediaQuery } from 'runed';
	import { onMount } from 'svelte';

	let { query, match, unmatch } = $props();

	let mounted = $state(false);
	const mediaQuery = new MediaQuery(query);


    onMount(()=>{
        mounted = true;
    })
</script>

{#if mounted}
	{#if mediaQuery.matches}
		{@render match()}
	{:else}
		{@render unmatch()}
	{/if}
{/if}
