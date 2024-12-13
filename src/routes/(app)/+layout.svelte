<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DesktopSidebar from '$lib/components/layout/desktop-sidebar.svelte';
	import MobileFooter from '$lib/components/layout/mobile-footer.svelte';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
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

<div
	class="flex min-h-screen w-full justify-center bg-background text-foreground"
	data-vaul-drawer-wrapper
>
	<div class="flex w-full max-w-screen-lg">
		<DesktopSidebar />
		{#key data.url}
			<div class="w-full pb-20 lg:pb-0 flex-grow bg-background lg:drop-shadow dark:lg:border-x" in:scale={{start:1.005, duration: 150}}>
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
		@apply bg-background overflow-x-hidden;
	}
</style>
