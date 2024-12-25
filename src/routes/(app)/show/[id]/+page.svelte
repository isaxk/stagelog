<script lang="ts">
	import ShowPageLogItem from '$lib/components/log-list/show-page-log-item.svelte';
	import AddToTimeline from '$lib/components/show-list/add-to-timeline.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { ArrowLeft } from 'lucide-svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { scrollY } from 'svelte/reactivity/window';

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
				class="sticky top-0 mx-auto aspect-square w-40 max-w-40 rounded-lg border border-border object-cover drop-shadow"
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
	<div class="relative h-[360px] w-full">
		<img
			src={data.show.image_url}
			alt="Artwork"
			class="z-0 h-full w-full object-cover transition-all {(scrollY.current ?? 0) < 1
				? 'fixed -top-1 left-0 max-h-[360px]'
				: ''}"
		/>

		<div
			class="fixed left-0 right-0 top-0 z-40 flex w-full flex-row items-center gap-4 p-4 pb-3 pt-ios-top transition-all {(scrollY.current ??
				0) > 300
				? 'border-b border-border bg-background drop-shadow-md'
				: 'bg-transparent'}"
		>
			<div class="">
				<button
					class="block rounded-full p-2 drop-shadow-md {(scrollY.current ?? 0) > 300
						? 'text-foreground'
						: 'bg-black/80 text-white'}"
					onclick={() => history.back()}
					><ArrowLeft />
				</button>
			</div>
			{#if (scrollY.current ?? 0) > 300}
				<div
					class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap text-lg font-semibold"
				>
					{data.show.name}
				</div>
			{/if}
		</div>
		<div
			class="inset-0 z-20 bg-gradient-to-t from-black/5 to-black/80 transition-all {(scrollY.current ??
				0) < 1
				? 'fixed -top-1 left-0 max-h-[360px]'
				: 'absolute'}"
		></div>
	</div>
	<div class="w-full p-4">
		<div class="flex h-full w-full flex-col justify-between">
			<div class="font-serif text-4xl font-medium">
				{data.show.name}
			</div>
			<div class="flex h-full w-full flex-col gap-4">
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
				<div class="-mt-4 h-0"></div>
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
