<script lang="ts">
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { browser } from '$app/environment';
	import { goto, disableScrollHandling, onNavigate } from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { cubicIn, cubicInOut, cubicOut, linear, quadIn, quartOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';

	let { children, data } = $props();

	let { session } = $state(data);

	const lg = new MediaQuery('min-width: 1024px');

	if (browser && !session && !page.url.pathname.includes('user')) {
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

<div
	class="flex min-h-screen w-full justify-center bg-background text-foreground"
	data-vaul-drawer-wrapper
	data-sveltekit-noscroll
>
	<div class="w-full lg:flex lg:w-[1024px]">
		<DesktopSidebar />
		{#key data.url}
			<div
				class="w-full flex-grow bg-background pb-20 transition-all lg:min-w-[786px] lg:pb-0 lg:drop-shadow dark:lg:border-x"
				out:scale={{ duration: 150, start: lg.current ? 0.995 : 0.99, easing: cubicIn }}
				in:scale={{
					duration: 150,
					start: lg.current ? 0.995 : 0.99,
					delay: 100,
					easing: cubicOut
				}}
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
		@apply overflow-x-hidden overflow-y-scroll bg-background;
	}
</style>
