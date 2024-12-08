<script lang="ts">
	import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import Calendar from './ui/calendar/calendar.svelte';
	import { Drawer } from 'vaul-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Rating from './rating.svelte';
	import Textarea from './ui/textarea/textarea.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Tables } from '$lib/supabase/types';
	import CustomButton from './custom-button.svelte';

	let { id, onchoose, mobile } = $props();

	let productions: Tables<'productions'>[] = $state([]);
	let selectedDate: DateValue | null = $state(null);
	let selectedLocation: Tables<'productions'> | null = $state(null);
	let rating: number = $state(5);
	let comments: string = $state('');

	let textboxValue = $state('');

	let stageHistory = $state([0]);
	let currentStage = $derived(stageHistory[stageHistory.length - 1]);
	let lastStage = $derived(stageHistory[stageHistory.length - 2]);

	onMount(async () => {
		if (!supabase.client) return;
		const productionsResponse = await supabase.client
			.from('productions')
			.select('*')
			.eq('show', id)
			.eq('tour', false);
		const toursResponse = await supabase.client
			.from('productions')
			.select('*')
			.eq('show', id)
			.eq('tour', true);
		productions = [...(productionsResponse.data ?? []), ...(toursResponse.data ?? [])];
	});

	function incrementStage(increment: number) {
		stageHistory.push(currentStage + increment);
	}
</script>

{#if mobile}
	<div class="z-20 flex h-16 items-center justify-center rounded-t-lg bg-zinc-100 p-4 drop-shadow">
		<div class="flex w-full max-w-screen-sm items-center">
			{#if currentStage === 0}
				<Drawer.Close class="w-20 py-4 text-left text-blue-400">Cancel</Drawer.Close>
			{:else}
				<button onclick={() => incrementStage(-1)} class="w-20 py-4 text-left text-blue-400"
					>Back</button
				>
			{/if}
			<div class="flex-grow text-center font-semibold">
				{#if currentStage === 0}
					Choose Location
				{:else if currentStage === 1}
					Select Date
				{:else if currentStage === 2}
					Comments
				{/if}
			</div>
			<Drawer.Close
				onclick={() => onchoose(selectedLocation, selectedDate, rating, comments)}
				class="w-20 text-right font-medium {currentStage !== 2 ? 'text-zinc-500' : 'text-blue-500'}"
				disabled={currentStage !== 2}>Done</Drawer.Close
			>
		</div>
	</div>
{:else}
	<Dialog.Header class="flex">
		<div class="flex gap-4">
			<button
				onclick={() => incrementStage(-1)}
				class="flex w-14 items-center gap-1 text-left text-blue-400"
				><ArrowLeft size={16} /> Back</button
			>
			<div class="font-semibold">
				{#if currentStage === 0}
					Choose Location
				{:else if currentStage === 1}
					Select Date
				{:else if currentStage === 2}
					Comments
				{/if}
			</div>
		</div>
	</Dialog.Header>
{/if}
<div class="relative h-full min-h-0 flex-grow">
	{#key currentStage}
		<div
			class="absolute bottom-0 left-1/2 top-0 z-0 mx-auto flex w-full max-w-screen-sm -translate-x-1/2 justify-center overflow-y-scroll px-4 py-4 sm:px-0"
			in:fly={{ x: currentStage > lastStage ? 100 : -100, duration: 200 }}
			out:fly={{ x: currentStage > lastStage ? -100 : 100, duration: 200 }}
		>
			{#if currentStage === 0}
				{#if productions.length > 0}
					<div class="flex h-full w-full flex-col gap-2">
						{#each productions as production}
							<button
								onclick={() => {
									selectedLocation = production;
									incrementStage(1);
								}}
								class="flex h-max w-full items-center rounded border border-border bg-white p-3 text-left drop-shadow-sm"
							>
								<div
									class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap text-lg font-medium"
								>
									{production.district ?? production.tour_name}
								</div>
								{#if production.tour}
									<div class="rounded-full bg-zinc-300 px-3 py-1 text-xs">TOUR</div>
								{/if}
							</button>
						{/each}
						<div class="flex-grow"></div>
						<!-- <form class="flex items-center border-t border-border py-3">
							<input
								bind:value={textboxValue}
								type="text"
								placeholder="Custom..."
								class="w-full rounded border p-3 drop-shadow"
							/>
							<button
								type="submit"
								onclick={() => {
									selectedLocation = { custom: textboxValue };
									incrementStage(1);
								}}
								class="px-3 py-4 pl-4 text-blue-500 disabled:text-zinc-500"
								disabled={textboxValue.length < 1}>Next</button
							>
						</form> -->
					</div>
				{/if}
			{:else if currentStage === 1}
				<Calendar
					type="single"
					onValueChange={(e) => {
						selectedDate = e ?? null;
						incrementStage(1);
					}}
					class="flex w-full flex-col items-center"
					maxValue={today(getLocalTimeZone())}
				/>
			{:else if currentStage === 2}
				<form class="h-full w-full flex-col p-4" onsubmit={(e) => e.preventDefault()}>
					<div class="text-lg font-medium">Rating:</div>
					<Rating bind:value={rating} />
					<div class="py-2 text-lg font-medium">Comments:</div>
					<Textarea class="h-72 resize-none" bind:value={comments}/>
					<div class="h-4"></div>
					<Dialog.Close
						type="submit"
						class="w-full"
						onclick={() => onchoose(selectedLocation, selectedDate, rating, comments)}
						><CustomButton onclick={() => {}}>Done</CustomButton></Dialog.Close
					>
				</form>
			{/if}
		</div>
	{/key}
</div>
