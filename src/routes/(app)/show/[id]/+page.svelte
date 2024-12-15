<script lang="ts">
	import ShowPageLogItem from '$lib/components/log-list/show-page-log-item.svelte';
	import AddToTimeline from '$lib/components/show-list/add-to-timeline.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { ArrowLeft } from 'lucide-svelte';
	import { MediaQuery } from 'svelte/reactivity';

	let { data } = $props();

	let sm = new MediaQuery('(min-width: 640px)');
</script>

{#if sm.current}
	<div class="flex h-20 items-center pl-4">
		<button onclick={() => history.back()}><ArrowLeft /></button>
	</div>
	<div class="p-4">
		<div class="flex h-full w-full flex-col gap-4 sm:flex-row">
			<img
				src={data.show.image_url}
				alt="Poster"
				class="mx-auto aspect-square w-40 max-w-40 rounded-lg border border-border object-cover drop-shadow"
			/>
			<div class="flex h-full w-full flex-col justify-between">
				<div class="font-serif text-4xl font-medium">
					{data.show.name}
				</div>
				<div class="flex h-full flex-col gap-4">
					<div class="flex flex-grow flex-col">
						<div>{data.show.playwright}</div>
						<div class="h-2 flex-grow"></div>

						<div class="flex flex-grow flex-col gap-1">
							{#each data.show.tags as tag}
								<div
									class="h-max w-max rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 drop-shadow-sm"
								>
									{tag}
								</div>
							{/each}
						</div>
					</div>
					{#if data.profile}
						<div class="flex flex-row items-center gap-2 text-right">
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
			<AddToTimeline show={data.show} mobile={false} bigButton />
		</div>
		<div class="h-4"></div>
		<div class="flex min-h-96 flex-col gap-2 rounded-md border bg-background p-4 drop-shadow-sm">
			{#each data.logs as log}
				<ShowPageLogItem
					{log}
					profile={data.profiles.find((o: Tables<'profiles'>) => o.id === log.user_id)}
				/>
			{/each}
		</div>
	</div>
{:else}
	<div class="relative w-full h-[360px]">
		<img src={data.show.image_url} alt="Artwork" class="w-full h-full object-cover">
		<div class="absolute top-0 left-0 p-4 z-40"><button class="bg-black/80 p-2 rounded-full drop-shadow-md text-white" onclick={() => history.back()}><ArrowLeft /></button></div>
		<div class="absolute bg-gradient-to-t from-black/5 z-20 to-black/20 inset-0"></div>
	</div>
	<div class="p-4 w-full">
		<div class="flex h-full w-full flex-col justify-between">
			<div class="font-serif text-4xl font-medium">
				{data.show.name}
			</div>
			<div class="flex h-full flex-col gap-4 w-full">
				<div class="flex flex-grow flex-col">
					<div>{data.show.playwright}</div>
					<div class="h-2 flex-grow"></div>

					<div class="flex flex-grow flex-col gap-1">
						{#each data.show.tags as tag}
							<div
								class="h-max w-max rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 drop-shadow-sm"
							>
								{tag}
							</div>
						{/each}
					</div>
				</div>
				{#if data.profile}
					<div class="flex flex-row items-center gap-2 text-right">
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
				<div class="h-0 -mt-4"></div>
				<AddToTimeline show={data.show} mobile={false} bigButton />
			</div>
			
		</div>
		<div class="h-5"></div>
		<div class="flex min-h-96 flex-col gap-2 rounded-md border bg-background p-4 drop-shadow-sm">
			{#each data.logs as log}
				<ShowPageLogItem
					{log}
					profile={data.profiles.find((o: Tables<'profiles'>) => o.id === log.user_id)}
				/>
			{/each}
		</div>
		
	</div>
{/if}
