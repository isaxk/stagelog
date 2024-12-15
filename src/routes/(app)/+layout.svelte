<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { page, navigating } from '$app/stores';
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import InstallBanner from '$lib/components/layout/install-banner.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { Download } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Drawer } from 'vaul-svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	let { children, data } = $props();

	let { supabase, session } = $state(data);

	async function signIn() {
		await supabase.auth.signInWithOAuth({
			provider: 'google'
		});
	}

	if (browser && !session && !$page.url.pathname.includes('user')) {
		goto('/');
	}
</script>

<Toaster
	toastOptions={{
		classes: {
			toast: 'bottom-16 sm:bottom-0'
		}
	}}
/>
{#if $navigating}
	<div class="fixed left-0 right-0 bottom-[90px] sm:top-0 h-0.5 bg-blue-500 drop-shadow animate-pulse duration-1000 z-[1000]"></div>
{/if}
<div
	class="flex min-h-screen w-full justify-center bg-background text-foreground"
	data-vaul-drawer-wrapper
>
	<div class="flex w-full max-w-screen-lg">
		<DesktopSidebar />
		{#key data.url}
			<div
				class="w-full flex-grow bg-background pb-20 transition-all lg:pb-0 lg:drop-shadow dark:lg:border-x"
				in:scale={{ start: 1.01, duration: 150 }}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</div>
{#if session?.user}
	<MobileFooter />
{/if}

<style lang="postcss">
	:global(body) {
		@apply overflow-x-hidden bg-background;
	}
</style>
