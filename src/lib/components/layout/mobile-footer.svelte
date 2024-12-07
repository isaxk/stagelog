<script lang="ts">
	import { Heart, List, SquarePen } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import AddShows from '../../../routes/(app)/add/+page.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { preloadData } from '$app/navigation';

	let preloadedData: any = $state(null);

	onMount(() => {
		preloadData("/add").then((result)=>{
			if(result.type==='loaded') {
				preloadedData = result.data
			}
		})
	});
</script>

<div
	class="fixed bottom-0 left-0 right-0 flex lg:hidden h-16 items-center justify-evenly bg-white drop-shadow"
>
	<a href="/log" class="flex w-20 flex-col items-center text-center text-xs">
		<List size={28} />
	</a>

	<!-- <a href="/wishlist" class="flex w-20 flex-col items-center text-center text-xs">
		<Heart size={28} />
	</a> -->

	<Drawer.Root shouldScaleBackground>
		<Drawer.Trigger
			class="flex w-20 flex-col items-center rounded-xl border border-border bg-zinc-50 px-2 py-2 text-center text-xs drop-shadow-sm"
			><SquarePen size={26} /></Drawer.Trigger
		>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/80" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 flex h-[95%] flex-col rounded-t-lg bg-zinc-50 outline-none"
			>
				{#if preloadedData}
					<AddShows data={{...preloadedData, mobile: true}} />
				{/if}
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>

	<a
		href="/user/{supabase.userProfile?.username}"
		class="flex w-20 flex-col items-center text-center text-xs"
	>
		<img
			src={supabase.userProfile?.avatar_url}
			class="w-[36px] rounded-full border border-border drop-shadow-xl"
			alt=""
		/>
	</a>
</div>
