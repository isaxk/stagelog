<script lang="ts">
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { scale } from 'svelte/transition';

	let { children, data } = $props();

	let { session } = $state(data);

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
