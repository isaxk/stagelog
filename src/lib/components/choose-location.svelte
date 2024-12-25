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

	let productions: Tables<'districts'>[] = $state([]);
	let selectedDate: DateValue | null = $state(null);
	let selectedLocation: Tables<'districts'> | null = $state(null);
	let rating: number = $state(5);
	let comments: string = $state('');

	let textboxValue = $state('');

	let stageHistory = $state([0]);
	let currentStage = $derived(stageHistory[stageHistory.length - 1]);
	let lastStage = $derived(stageHistory[stageHistory.length - 2]);

	onMount(async () => {
		if (!supabase.client) return;
		// const productionsResponse = await supabase.client
		// 	.from('productions')
		// 	.select('*')
		// 	.eq('show', id)
		// 	.eq('tour', false);
		// const toursResponse = await supabase.client
		// 	.from('productions')
		// 	.select('*')
		// 	.eq('show', id)
		// 	.eq('tour', true);
		const locations = await supabase.client.from('districts').select('*');
		productions = locations.data ?? [];
	});

	function incrementStage(increment: number) {
		stageHistory.push(currentStage + increment);
	}
</script>

{#if mobile}
	<div class="z-20 flex h-16 items-center justify-center rounded-t-lg bg-muted p-4 drop-shadow">
		<div class="flex w-full max-w-screen-sm items-center">
			{#if currentStage === 0}
				<Drawer.Close class="w-20 py-4 text-left text-blue-400 outline-none">Cancel</Drawer.Close>
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
			<button
				type="submit"
				onclick={() => onchoose(selectedLocation, selectedDate, rating, comments, id)}
				class="w-20 text-right font-medium {currentStage !== 2
					? 'text-muted-foreground'
					: 'text-blue-500'}"
				disabled={currentStage !== 2}>Done</button
			>
		</div>
	</div>
{:else}
	<Dialog.Header class="flex">
		<div class="flex gap-4">
			<button
				onclick={() => incrementStage(-1)}
				disabled={currentStage < 1}
				class="flex w-14 items-center gap-1 text-left text-blue-400 disabled:text-muted-foreground"
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
								class="flex h-max w-full items-center rounded border border-border bg-card p-3 text-left drop-shadow-sm"
							>
								<div
									class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap text-lg font-medium"
								>
									{production.name}
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
								class="px-3 py-4 pl-4 text-blue-500 disabled:text-foreground-muted"
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
					<Rating bind:value={rating} small={false} profile={false} />
					<div class="py-2 text-lg font-medium">Comments:</div>
					<Textarea class="h-72 resize-none" bind:value={comments} />
					<div class="h-4"></div>
					<Dialog.Close
						type="submit"
						class="hidden w-full lg:block"
						onclick={() => onchoose(selectedLocation, selectedDate, rating, comments, id)}
						><CustomButton onclick={() => {}}>Done</CustomButton></Dialog.Close
					>
				</form>
			{/if}
		</div>
	{/key}
</div>
