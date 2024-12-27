<script lang="ts">
	import ShowPageLogItem from '$lib/components/log-list/show-page-log-item.svelte';
	import AddToTimeline from '$lib/components/show-list/add-to-timeline.svelte';
	import type { Tables } from '$lib/types/supabase';
	import { ArrowLeft } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { scrollY } from 'svelte/reactivity/window';
	import { fade, scale } from 'svelte/transition';

	let { data } = $props();

	let mounted = $state(false);
	onMount(() => (mounted = true));
	onDestroy(() => (mounted = false));

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
			<AddToTimeline show={data.show} bigButton />
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
	{#if mounted}
		<div
			in:fade={{ duration: 200, delay: 1000 }}
			class={['fixed -left-10 -right-10 -top-10 -z-10 h-[360px] transition-all']}
		>
			<img
				src={data.show.image_url}
				alt="Artwork"
				class="z-0 h-full w-full object-cover object-top blur-xl brightness-[22%] transition-all"
			/>
		</div>
	{/if}
	<div class="relative h-[360px] w-full">
		{#if mounted}
			<img
				transition:fade={{ duration: 200, delay: 150, easing: cubicOut }}
				src={data.show.image_url}
				alt="Artwork"
				class="z-0 h-full w-full object-cover transition-all"
			/>
		{/if}
		<div class="fixed left-0 right-0 top-0 z-40 flex items-center">
			<div class="absolute left-0 top-0 z-50 pl-4 pt-ios-top">
				<button
					class="block rounded-full p-2 transition-all duration-200 {(scrollY.current ?? 0) > 290
						? 'text-foreground'
						: 'bg-black/80 text-white drop-shadow-md'}"
					onclick={() => history.back()}
					><ArrowLeft />
				</button>
			</div>
			<div
				style:opacity={((scrollY.current ?? 0) - 200) / 100}
				class="flex h-full w-full items-center gap-4 border-border bg-background px-4 pb-3 pt-ios-top drop-shadow"
			>
				<div class="w-10"></div>
				<div
					transition:fade={{ duration: 200 }}
					class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap pt-1.5 text-lg font-semibold"
				>
					{data.show.name}
				</div>
			</div>
		</div>
		<div
			class="absolute inset-0 z-20 bg-gradient-to-t from-black/5 to-black/80 transition-all"
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
