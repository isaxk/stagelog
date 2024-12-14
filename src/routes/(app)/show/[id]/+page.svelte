<script lang="ts">
	import ShowPageLogItem from '$lib/components/log-list/show-page-log-item.svelte';
	import AddToTimeline from '$lib/components/show-list/add-to-timeline.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { ArrowLeft } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex h-20 items-center pl-4">
	<button onclick={() => history.back()}><ArrowLeft /></button>
</div>
<div class="p-4">
	<div class="flex gap-4">
		<img
			src={data.show.image_url}
			alt="Poster"
			class="aspect-square h-40 w-40 rounded-lg object-cover"
		/>
		<div class="flex w-full flex-col gap-2">
			<div class="font-serif text-4xl font-medium">
				{data.show.name}
			</div>
			<div>{data.show.playwright}</div>
			<div class="flex-grow"></div>
			<div class="flex w-full items-end">
				<div class="flex flex-grow gap-1">
					{#each data.show.tags as tag}
						<div
							class="h-max w-max rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 drop-shadow-sm"
						>
							{tag}
						</div>
					{/each}
				</div>
				{#if data.profile}
					<div class="flex flex-col items-end gap-1 text-right">
						<div class="text-sm">Submitted by:</div>
						<a href="/user/{data.profile.username}" class="flex items-center gap-1">
							<img
								src={data.profile.avatar_url}
								alt="Profile Pic"
								class="aspect-square h-6 w-6 rounded-full object-cover"
							/>
							{data.profile.username}
						</a>
					</div>
				{/if}
			</div>
		</div>
        <AddToTimeline show={data.show} mobile={false}/>
	</div>
    <div class="h-4"></div>
	<div class="p-4 border bg-background drop-shadow-sm rounded-md flex flex-col gap-2 min-h-96">
		{#each data.logs as log}
			<ShowPageLogItem {log} profile={data.profiles.find((o:Tables<'profiles'>)=>o.id===log.user_id)} />
		{/each}
	</div>
</div>
