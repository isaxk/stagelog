<script lang="ts">
	import { Drawer } from 'vaul-svelte';
	import * as Dialog from '../ui/dialog';
	import type { Tables } from '$lib/types/supabase';
	import { MediaQuery } from 'svelte/reactivity';
	import { PlusCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import CustomButton from '../custom-button.svelte';
	import DetailsPicker from '../details-picker/details-picker.svelte';
	import type { DateValue } from '@internationalized/date';
	import { browserClient } from '$lib/supabase/client';

	let { show, bigButton = false } = $props();

	const lg = new MediaQuery('min-width: 1000px');

	async function handleSubmit(
		location: Tables<'districts'>,
		date: DateValue,
		rating: number,
		comments: string,
		show_id: number
	) {
		open = false;
		toast.promise(
			async () => {
				const supabase = await browserClient();
				const { error } = await supabase
					.from('log_entries')
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
				return { error };
			},
			{
				loading: 'Loading...',
				success: () => {
					return `Show has been added to your timeline`;
				},
				error: 'An error occured'
			}
		);
	}

	let open = $state(false);
</script>

{#if !lg.current}
	<Drawer.Root shouldScaleBackground bind:open>
		<Drawer.Trigger class="z-0 p-1 outline-none">
			{#if bigButton}
				<CustomButton onclick={() => {}} class="w-full min-w-40 px-0">Add to timeline</CustomButton>
			{:else}
				<PlusCircle />
			{/if}
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay
				class="fixed inset-0 bg-black/60 backdrop-blur-[1px] dark:bg-black/60 dark:backdrop-blur-[0.5px]"
			/>
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 z-20 flex h-drawer flex-col rounded-t-lg bg-background outline-none"
			>
				<DetailsPicker id={show.id} onchoose={handleSubmit} drawer />
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open>
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
			<DetailsPicker id={show.id} onchoose={handleSubmit} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
