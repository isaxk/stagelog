<script lang="ts">
	import Rating from '../rating.svelte';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { supabase } from '$lib/supabase/client.svelte';
	import type { Tables } from '$lib/types/supabase';
	import { debounce } from '$lib/utils/time';
	import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date';
	import { CalendarClock, EllipsisVertical, Pencil, Trash } from 'lucide-svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import Skeleton from '../ui/skeleton/skeleton.svelte';
	import { DateTime } from 'luxon';

	let {
		i,
		item = $bindable(),
		profile = null,
		onUpdate = () => null,
		onDelete = () => null
	}: {
		i: number;
		item: {
			show: Promise<Tables<'shows'>>;
			log_entry: Tables<'log_entries'>;
		};
		profile: Tables<'profiles'> | null;
		onUpdate?: (id: number, values: any) => void;
		onDelete?: (id: number) => void;
	} = $props();

	let log = $derived(item.log_entry);
	let rating = $state(item.log_entry.rating);
	let date = $derived(item.log_entry.date);

	const dateDisplay = $derived(DateTime.fromSQL(date!).toFormat('MMM dd').split(' '));

	async function handleRatingChange(value: number) {
		onUpdate(log.id, { rating: value });
	}

	async function handleDateChange(value: DateValue | undefined) {
		datePickerOpen = false;
		if (!value) return;

		const date = DateTime.local(value.year, value.month, value.day);

		onUpdate(log.id, { date: date.toSQLDate() });
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
		onDelete(log.id);
	}

	let datePickerOpen = $state(false);

	let commentEditMode = $state(false);
	let firstDone = $state(false);
	item.show.then(() => {
		setTimeout(() => (firstDone = true), 400);
	});
	let commentValue = $state(item.log_entry.comments);

	const lg = new MediaQuery('min-width: 1024px');
</script>

<Dialog.Root bind:open={datePickerOpen}>
	<Dialog.Content class="h-96 w-max rounded-lg bg-background">
		<Calendar
			type="single"
			value={parseDate(date ?? '')}
			maxValue={today(getLocalTimeZone())}
			onValueChange={handleDateChange}
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

{#await item.show}
	<div class="flex h-full w-full items-center gap-4">
		<Skeleton class="h-6 w-16" />
		<Skeleton class="h-full w-full" />
	</div>
{:then show}
	<div class="w-full" in:fade={{ duration: firstDone ? 0 : 200 }}>
		{#if show}
			<div class="flex w-full items-center gap-3 sm:gap-2">
				<button
					onclick={() => (datePickerOpen = profile === null)}
					class="flex h-full min-w-8 flex-col sm:min-w-14 sm:flex-row"
				>
					{#if date !== null}
						<div class="w-full text-left font-medium sm:text-center">
							{dateDisplay[0]}
						</div>
						<div class="w-full text-left sm:text-center">
							{dateDisplay[1]}
						</div>
					{/if}
				</button>
				<div
					class="flex h-full min-w-0 flex-grow items-center gap-2 overflow-hidden rounded-md border border-border/80 bg-card drop-shadow will-change-transform {!lg.current &&
					!log.comments &&
					!lg.current &&
					profile !== null
						? 'flex-row'
						: 'flex-col'}  lg:flex-row"
				>
					<div
						class="flex h-full w-full min-w-0 items-center gap-2 drop-shadow-md will-change-transform"
					>
						<a href="/show/{show.id}" class="aspect-square h-[70px]">
							<img
								in:fade
								src={show.image_url}
								alt="d"
								class="h-full w-full border-r border-border object-cover drop-shadow-md"
							/>
						</a>
						<a class="block min-w-0 flex-grow py-2" href="/show/{show.id}">
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
							class="-mt-2 flex w-full items-center gap-2 border-t bg-muted/40 px-1 py-1 pr-2 lg:m-0 lg:flex-col lg:items-end lg:justify-end lg:gap-1 lg:border-none lg:bg-card lg:p-0 lg:text-right"
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
												bind:value={rating}
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
									bind:value={rating}
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
								bind:value={rating}
								small
								profile={profile !== null}
								onchange={handleRatingChange}
							/>
						</div>
					{/if}
					<div class="hidden lg:block">
						{@render popout()}
					</div>
					<div class="hidden w-2 lg:block"></div>
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
	</div>
{/await}
