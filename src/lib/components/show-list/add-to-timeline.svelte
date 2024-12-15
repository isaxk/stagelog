<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { Drawer } from 'vaul-svelte';
	import ChooseLocation from '../choose-location.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { acts } from '@tadashi/svelte-notification';
	import { fly } from 'svelte/transition';
	import ShowListItemCard from './show-list-item-card.svelte';
	import * as Dialog from '../ui/dialog';
	import type { Tables } from '$lib/supabase/types';
	import { MediaQuery } from 'svelte/reactivity';
	import { PlusCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import CustomButton from '../custom-button.svelte';

	let { show, mobile, bigButton = false } = $props();

	const lg = new MediaQuery('min-width: 1000px');

	async function handleSubmit(
		location: Tables<'districts'>,
		date: any,
		rating: number,
		comments: string,
		show_id: number
	) {
		toast.promise(
			async () => {
				const { data, error } = await supabase
					.client!.from('log_entries')
					.insert([
						{
							location: location.name,
							show_id,
							date: `${date.year}, ${date.month}, ${date.day}`,
							rating,
							comments
						}
					])
					.select('*');
			},
			{
				loading: 'Loading...',
				success: (data) => {
					return `Show has been added to your timeline`;
				},
				error: 'Error'
			}
		);
	}
</script>

{#if !lg.current}
	<Drawer.Root shouldScaleBackground>
		<Drawer.Trigger class="z-0 p-1 outline-none">
			{#if bigButton}
				<CustomButton onclick={() => {}} class="min-w-40 w-full px-0">Add to timeline</CustomButton>
			{:else}
				<PlusCircle />
			{/if}
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/60 dark:bg-black/60 backdrop-blur-[1px] dark:backdrop-blur-[0.5px]" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 z-20 flex h-drawer flex-col rounded-t-lg bg-background outline-none"
			>
				<ChooseLocation id={show.id} onchoose={handleSubmit} mobile={true} />
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{:else}
	<Dialog.Root>
		<Dialog.Trigger class="p-1"
			>{#if bigButton}
				<CustomButton onclick={() => {}} class="min-w-40 px-0">Add to timeline</CustomButton>
			{:else}
				<PlusCircle />
			{/if}</Dialog.Trigger
		>
		<Dialog.Content
			class="flex h-[600px] w-full max-w-screen-sm flex-col overflow-hidden bg-background"
		>
			<ChooseLocation id={show.id} onchoose={handleSubmit} {mobile} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
