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

	let { show, onsubmit, mobile } = $props();

	const lg = new MediaQuery('min-width: 1000px')

	async function handleSubmit(location: Tables<'districts'>, date: any, rating: number, comments: string, show_id: number) {
		onsubmit({
			location: location.name,
			show_id,
			date: `${date.year}, ${date.month}, ${date.day}`,
			rating,
			comments
		});
	}
</script>

{#if !lg.current}
	<Drawer.Root shouldScaleBackground>
		<Drawer.Trigger class="z-0">
			<ShowListItemCard {show} />
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/80 backdrop-blur-[1px] backdrop-saturate-50" />
			<Drawer.Content
				class="fixed bottom-0 z-20 left-0 right-0 flex h-[95%] flex-col rounded-t-lg bg-background outline-none"
			>
				<ChooseLocation id={show.id} onchoose={handleSubmit} mobile={true} />
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{:else}
	<Dialog.Root>
		<Dialog.Trigger><ShowListItemCard {show} /></Dialog.Trigger>
		<Dialog.Content
			class="flex h-[600px] w-full max-w-screen-sm flex-col overflow-hidden bg-background"
		>
			<ChooseLocation id={show.id} onchoose={handleSubmit} {mobile} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
