<script lang="ts">
	import Rating from '../rating.svelte';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { supabase } from '$lib/supabase/client.svelte';
	import type { Tables } from '$lib/supabase/types';
	import { debounce } from '$lib/utils/time';
	import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date';
	import { CalendarClock, EllipsisVertical, Pencil, Trash } from 'lucide-svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { fade, slide } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';

	let {
		i,
		item = $bindable(),
		profile = null
	}: {
		i: number;
		item: {
			show: Tables<'shows'>;
			log_entry: Tables<'log_entries'>;
		};
		profile: Tables<'profiles'> | null;
	} = $props();

	let show = $derived(item.show);
	let log = $derived(item.log_entry);

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
		if (!value) return;
		if (!supabase.client) return;

		const { data, error } = await supabase.client
			.from('log_entries')
			.update({ date: `${value.year}, ${value.month}, ${value.day}` })
			.eq('id', log.id)
			.select('*');

		console.log(data, error);
	}

	const handleCommentChange = debounce(async () => {
		datePickerOpen = false;
		log.comments = commentValue;
		if (!supabase.client) return;

		const { data, error } = await supabase.client
			.from('log_entries')
			.update({ comments: commentValue })
			.eq('id', log.id)
			.select('*');

		console.log(data, error);
	}, 500);

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

	let commentEditMode = $state(false);
	let commentValue = $state(item.log_entry.comments);

	const lg = new MediaQuery('min-width: 1024px');
</script>

<Dialog.Root bind:open={datePickerOpen}>
	<Dialog.Content class="h-96 w-max rounded-lg bg-background">
		<Calendar
			type="single"
			value={parseDate(log.date ?? '')}
			maxValue={today(getLocalTimeZone())}
			onValueChange={(e: any) => handleDateChange(e)}
		></Calendar>
	</Dialog.Content>
</Dialog.Root>

{#snippet popout()}
	{#if !profile}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger><EllipsisVertical size={18} /></DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => (datePickerOpen = true)}
						><CalendarClock /> Change Date</DropdownMenu.Item
					>
					<DropdownMenu.Item onclick={deleteLog}><Trash /> Delete</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
{/snippet}

{#if show}
	<div class="flex w-full items-center gap-4 sm:gap-0">
		<button
			onclick={() => (datePickerOpen = true)}
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
		</button>
		<div
			class="flex h-full min-w-0 flex-grow items-center gap-2 will-change-transform rounded-md overflow-hidden border border-border/80 bg-card drop-shadow {!lg.current &&
			!log.comments &&
			!lg.current &&
			profile !== null
				? 'flex-row'
				: 'flex-col'}  lg:flex-row"
		>
			<div class="flex w-full h-full min-w-0 items-center gap-2 will-change-transform drop-shadow-md">
				<a href="/show/{show.id}" class="h-[70px] aspect-square">
					<img
						in:fade
						src={show.image_url}
						alt="d"
						class="h-full w-full object-cover drop-shadow-md border-r border-border"
					/>
				</a>
				<a class="min-w-0 block flex-grow py-2" href="/show/{show.id}">
					<div
						class="font w-full min-w-0 overflow-x-hidden text-ellipsis text-nowrap font-serif text-2xl"
					>
						{show.name}
					</div>
					<div class="flex h-full items-center gap-2 text-sm">
						<div class="min-w-0 flex-grow overflow-hidden text-ellipsis text-nowrap font-light">
							{log.location}
						</div>
					</div>
				</a>
			</div>
			{#if lg.current || log.comments || profile === null}
				<div
					class="flex w-full items-center px-1 py-1 pr-2 border-t bg-muted/40 lg:bg-card -mt-2 gap-2 lg:flex-col lg:items-end lg:justify-end lg:gap-1 lg:text-right lg:p-0 lg:m-0 lg:border-none"
				>
					<Dialog.Root>
						<Dialog.Trigger
							class="flex h-full w-full min-w-0 flex-grow text-left italic text-muted-foreground outline-none lg:items-end lg:justify-end lg:text-right"
						>
							{#if log.comments}
								<p
									class="-mr-1 line-clamp-1 h-max w-full min-w-0 overflow-hidden text-ellipsis break-words text-left font-light lg:pr-2 lg:text-right"
								>
									"{log.comments}"
								</p>
							{:else if !profile}
								<p class="text-xs">Add comment</p>
							{/if}
						</Dialog.Trigger>
						<Dialog.Content class="bg-background">
							<Dialog.Header>
								<Dialog.Title>{show.name}</Dialog.Title>
							</Dialog.Header>

							{#if profile}
								<div class="flex flex-col gap-2">
									<span class="font-light italic"> "{log.comments}"</span>
									<div class="flex gap-2">
										<Rating value={log.rating} small profile={profile !== null} />
										<div class="">
											{profile.username}
										</div>
									</div>
								</div>
							{:else}
								<div class="flex flex-col gap-3">
									{#if commentEditMode}
										<Textarea
											autofocus
											bind:value={commentValue}
											maxlength={200}
											class="resize-none"
											onblur={() => {
												if (commentValue !== log.comments) handleCommentChange();
												commentEditMode = false;
											}}
											onkeyup={handleCommentChange}
										/>
									{:else}
										<button
											onclick={() => (commentEditMode = true)}
											class="flex items-center text-left font-light italic"
										>
											<div class="flex flex-grow">
												"{log.comments}"
											</div>
											<Pencil size={15} />
										</button>
									{/if}

									<Rating
										bind:value={log.rating}
										small
										profile={profile !== null}
										onchange={handleRatingChange}
									/>
								</div>
							{/if}
						</Dialog.Content>
					</Dialog.Root>
					<div class="flex min-w-20 items-center justify-end">
						<Rating
							bind:value={log.rating}
							small
							profile={profile !== null}
							onchange={handleRatingChange}
						/>
					</div>
					{#if !profile}
						<div class="flex items-center lg:hidden">
							{@render popout()}
						</div>
					{/if}
				</div>
			{/if}
			{#if !log.comments && !lg.current && profile !== null}
				<div class="flex h-full flex-col pr-2 lg:pr-0">
					<div class="flex-grow text-transparent">d</div>
					<Rating
						bind:value={log.rating}
						small
						profile={profile !== null}
						onchange={handleRatingChange}
					/>
				</div>
			{/if}
			<div class="hidden lg:block">
				{@render popout()}
			</div>
			<div class="w-2 hidden lg:block"></div>
		</div>
	</div>
{:else}
	<div class="flex min-h-20 w-full items-center gap-6 text-zinc-700/60 sm:min-h-14 sm:gap-0">
		<div
			class="flex w-2 -rotate-90 items-center justify-center gap-1 pt-1 text-sm font-semibold sm:min-w-16 sm:max-w-16 sm:-rotate-0 sm:justify-start sm:font-normal"
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
		<div class="text-xs">Custom show ommited because it is in review</div>
	</div>
{/if}
