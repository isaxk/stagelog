<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { Heart, List, Pencil, SquarePen, User, Users } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import AddShows from './add/+page.svelte';
	import { page } from '$app/stores';
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	let { children, data } = $props();

	let { supabase, session } = $state(data);

	async function signIn() {
		await supabase.auth.signInWithOAuth({
			provider: 'google'
		});
	}

	if(browser && !session && !$page.url.pathname.includes('user')) {
		goto("/")
	}
</script>

<div
	class="flex min-h-screen w-full justify-center overflow-visible bg-zinc-50"
	data-vaul-drawer-wrapper
>
	<div class="flex w-full max-w-screen-lg overflow-visible">
		<DesktopSidebar />
		<div class="w-full lg:drop-shadow bg-zinc-50">
			{@render children()}
		</div>
	</div>
</div>
{#if session?.user}
	<MobileFooter />
{/if}

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-50;
	}
</style>
