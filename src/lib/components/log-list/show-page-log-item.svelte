<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { onMount } from 'svelte';
	import Rating from '../rating.svelte';
	import { supabase } from '$lib/supabase/client.svelte';

	let { log, profile } = $props();
</script>

<div class="flex w-full flex-col pt-2 sm:flex-row sm:p-0">
	<div
		class="flex min-w-24 max-w-24 items-center justify-evenly gap-0 p-1 pr-2 text-sm sm:p-0 sm:pr-2"
	>
		{#each log.date.split('-').toReversed() as date, i}
			<div class="">
				{date}
			</div>
			{#if i < 2}
				<div>/</div>
			{/if}
		{/each}
	</div>

	<div class="flex flex-grow flex-col justify-center rounded border-border bg-card p-3 drop-shadow">
		{#if log.comments}
			<div class="flex gap-2">
				<div class="italic">
					"{log.comments}"
				</div>
			</div>
			<div class="h-1"></div>
		{/if}

		<div class="flex items-center gap-2">
			<Rating value={log.rating} small profile />
			-
			{#if profile}
				<a class="flex items-center gap-1" href="/user/{profile.username}">
					<img
						src={profile.avatar_url}
						class="aspect-square h-6 w-6 rounded-full object-cover"
						alt=""
					/>
					{profile.username}
				</a>
			{/if}
		</div>
	</div>
</div>
