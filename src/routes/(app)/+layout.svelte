<script lang="ts">
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { browser } from '$app/environment';
	import {
		goto,
		disableScrollHandling,
		onNavigate,
		beforeNavigate,
		afterNavigate
	} from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { cubicIn, cubicInOut, cubicOut, linear, quadIn, quartOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { scrollY } from 'svelte/reactivity/window';

	let { children, data } = $props();

	let { session } = $state(data);

	const lg = new MediaQuery('min-width: 1024px');

	if (browser && !session && !page.url.pathname.includes('user')) {
		goto('/');
	}

	afterNavigate(() => {
		disableScrollHandling();
		setTimeout(() => {
			scrollTo({ top: 0, behavior: 'instant' });
		}, 150);
	});

	// beforeNavigate(() => {
	// 	window.scrollTo({
	// 		top: 0
	// 	});
	// });
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
>
	<div class="w-full lg:flex lg:w-[1024px]">
		<DesktopSidebar />
		<div
			class="flex min-h-screen w-full flex-grow flex-nowrap bg-background lg:min-w-[786px] lg:border-x lg:pr-1"
		>
			{#key data.url}
				<div
					class="h-full w-full bg-background pb-20 transition-all lg:min-w-[784px] lg:pb-0"
					out:scale={{
						duration: 150,
						start: lg.current ? 0.995 : 0.995,
						easing: cubicIn,
						delay: 0
					}}
					in:scale={{
						duration: 150,
						start: lg.current ? 0.995 : 0.99,
						delay: 200,
						easing: cubicOut
					}}
				>
					{@render children()}
				</div>
			{/key}
		</div>
	</div>
</div>
{#if session?.user}
	<MobileFooter />
{/if}

<style lang="postcss">
	:global(body) {
		@apply overflow-x-hidden bg-background;
	}
	:global(html) {
		scrollbar-gutter: stable;
	}
</style>
