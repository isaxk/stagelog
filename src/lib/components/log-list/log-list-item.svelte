<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Rating from '../rating.svelte';

	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { Header } from '../ui/calendar';
	import type { Tables } from '$lib/supabase/types';
	import {
		Calendar1,
		CalendarClock,
		CalendarX2,
		Delete,
		EllipsisVertical,
		Trash
	} from 'lucide-svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
	import { getLocalTimeZone, today, type DateValue, parseDate } from '@internationalized/date';

	let {
		i,
		log,
		shows,
		productions,
		profile = null
	}: {
		i: number;
		log: Tables<'log_entries'>;
		shows: Tables<'shows'>[];
		productions: Tables<'productions'>[];
		profile: Tables<'profiles'> | null;
	} = $props();

	const production = productions.find((o: Tables<'productions'>) => o.id === log.production_id);
	const show = shows.find((o: Tables<'shows'>) => o.id === production?.show);

	async function handleRatingChange(value: number) {
		if (!supabase.client) return;
		const { data, error } = await supabase.client
			.from('log_entries')
			.update({ rating: value })
			.eq('id', log.id)
			.select('*');

		console.log(data, error);
	}

	async function handleDateChange(value: DateValue) {
		datePickerOpen = false;
		if(!value) return;
		if (!supabase.client) return;
		
		const { data, error } = await supabase.client
			.from('log_entries')
			.update({ date: `${value.year}, ${value.month}, ${value.day}` })
			.eq('id', log.id)
			.select('*');

		console.log(data, error);
	}

	async function deleteLog() {
		if (!supabase.client) return;
		const { data, error } = await supabase.client
			.from('log_entries')
			.delete()
			.eq('id', log.id)
			.select('*');

		console.log(data, error);
	}

	let datePickerOpen = $state(false);
</script>

{#snippet popout()}
	{#if !profile}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger><EllipsisVertical size={18} /></DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Group>
					<Dialog.Root bind:open={datePickerOpen}>
						<Dialog.Trigger>
							<DropdownMenu.Item
								><CalendarClock /> Change Date</DropdownMenu.Item
							>
						</Dialog.Trigger>
						<Dialog.Content class="h-96 w-max rounded-lg bg-zinc-50">
							<Calendar
								type="single"
								value={parseDate(log.date ?? '')}
								maxValue={today(getLocalTimeZone())}
								onValueChange={(e: any) => handleDateChange(e)}
							></Calendar>
						</Dialog.Content>
					</Dialog.Root>
					<DropdownMenu.Item onclick={deleteLog}><Trash /> Delete</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
{/snippet}

{#if show && production}
	<div class="h-18 flex w-full items-center gap-4 pr-2 sm:gap-0">
		<div
			class="flex w-2 -rotate-90 justify-center gap-1 pt-1 font-semibold sm:min-w-16 sm:max-w-16 sm:-rotate-0 sm:justify-start sm:font-normal"
		>
			{#if log.date !== null}
				{#each log.date.split('-').splice(1, 2).toReversed() as date, i}
					<div class="">
						{date}
					</div>
					{#if i < 1}
						<div>/</div>
					{/if}
				{/each}
			{/if}
		</div>
		<div
			class="flex min-w-0 flex-grow flex-col items-center gap-2 rounded border border-border/50 bg-white p-2 drop-shadow lg:flex-row"
		>
			<div class="flex w-full min-w-0 items-center gap-2">
				<img
					src={show.image_url}
					alt="d"
					class="aspect-square w-14 rounded object-cover drop-shadow-md"
				/>
				<div class="min-w-0 flex-grow">
					<div
						class="font w-full min-w-0 overflow-x-hidden text-ellipsis text-nowrap font-serif text-2xl"
					>
						{show.name}
					</div>
					<div class="flex h-full items-center gap-2 text-sm">
						<div class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap font-light">
							{production.district ?? production.tour_name}
						</div>
					</div>
				</div>
				{#if !log.comments}
					<div class="flex min-w-20 justify-end">
						<Rating
							value={log.rating ?? 5}
							small
							profile={profile !== null}
							onchange={handleRatingChange}
						/>
					</div>
					<div class="flex lg:hidden">
						{@render popout()}
					</div>
				{/if}
			</div>
			{#if log.comments}
				<div
					class="flex w-full items-center gap-2 lg:flex-col lg:items-end lg:justify-end lg:gap-1 lg:text-right"
				>
					<Dialog.Root>
						<Dialog.Trigger
							class="flex h-full w-full min-w-0 flex-grow text-left italic text-zinc-600 outline-none lg:items-end lg:justify-end lg:text-right"
						>
							<p
								class="-mr-1 line-clamp-1 h-max w-full min-w-0 overflow-hidden text-ellipsis break-words text-left font-light lg:pr-2 lg:text-right"
							>
								"{log.comments}"
							</p>
						</Dialog.Trigger>
						<Dialog.Content class="bg-zinc-50">
							<Dialog.Header>
								<Dialog.Title>{show.name}</Dialog.Title>
							</Dialog.Header>

							{#if profile}
								<div class="flex flex-col gap-2">
									<span class="font-light italic"> "{log.comments}"</span>
									<div class="flex gap-2">
										<Rating value={log.rating ?? 5} small profile={profile !== null} />-
										<div class="">
											{profile.username}
										</div>
									</div>
								</div>
							{:else}
								<div class="flex flex-col gap-3">
									<span class="font-light italic"> "{log.comments}"</span>

									<Rating value={log.rating ?? 5} small profile={profile !== null} />
								</div>
							{/if}
						</Dialog.Content>
					</Dialog.Root>
					<div class="flex min-w-20 justify-end items-center">
						<Rating
							value={log.rating ?? 5}
							small
							profile={profile !== null}
							onchange={handleRatingChange}
						/>
					</div>
					{#if !profile}
						<div class="lg:hidden flex items-center">
							{@render popout()}
						</div>
					{/if}
				</div>
			{/if}
			<div class="hidden lg:block">
				{@render popout()}
			</div>
		</div>
	</div>
{/if}
