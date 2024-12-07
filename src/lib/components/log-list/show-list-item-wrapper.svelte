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

	let { show, onsubmit, mobile } = $props();

	async function handleSubmit(location: Tables<'productions'>, date: any, rating: number, comments: string) {
		onsubmit({
			production_id: location.id,
			date: `${date.year}, ${date.month}, ${date.day}`,
			rating,
			comments
		});
	}
</script>

{#if mobile}
	<Drawer.NestedRoot>
		<Drawer.Trigger class="z-0">
			<ShowListItemCard {show} />
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/80 backdrop-blur-[1px] backdrop-saturate-50" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 flex h-[90%] flex-col rounded-t-lg bg-zinc-50 outline-none"
			>
				<ChooseLocation id={show.id} onchoose={handleSubmit} {mobile} />
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.NestedRoot>
{:else}
	<Dialog.Root>
		<Dialog.Trigger><ShowListItemCard {show} /></Dialog.Trigger>
		<Dialog.Content
			class="flex h-[600px] w-full max-w-screen-sm flex-col overflow-hidden bg-zinc-50"
		>
			<ChooseLocation id={show.id} onchoose={handleSubmit} {mobile} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
