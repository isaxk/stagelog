<script lang="ts">
	import { List, Search, Users } from 'lucide-svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { goto, preloadData } from '$app/navigation';
	import { navigating, page } from '$app/state';

	onMount(() => {
		preloadData('/log');
		preloadData('/contribute');
	});

	$effect(() => {
		if (supabase.userProfile?.username) {
			preloadData(`/user/${supabase.userProfile?.username}`);
		}
	});
</script>

<div
	class="fixed bottom-0 left-0 right-0 flex min-h-14 items-center justify-evenly border-t border-border bg-card py-3 pb-ios-bottom text-accent-foreground drop-shadow lg:hidden"
>
	{#if navigating.type}
		<div
			class="absolute left-0 right-0 top-0 z-[1000] h-0.5 animate-pulse bg-blue-500 drop-shadow duration-1000 sm:top-0"
		></div>
	{/if}
	<a
		href="/timeline"
		onmousedown={() => goto('/timeline')}
		class="flex w-20 flex-col items-center text-center text-xs {page.url.pathname === '/timeline'
			? 'text-blue-500'
			: ''}"
	>
		<List size={28} />
		Timeline
	</a>

	<a
		href="/log"
		onmousedown={() => goto('/log')}
		class="flex w-20 flex-col items-center text-center text-xs {page.url.pathname === '/log'
			? 'text-blue-500'
			: ''}"
	>
		<Search size={28} />
		Find shows
	</a>

	<a
		href="/contribute"
		onmousedown={() => goto('/contribute')}
		class="flex w-20 flex-col items-center text-center text-xs {page.url.pathname === '/contribute'
			? 'text-blue-500'
			: ''}"
	>
		<Users size={28} />
		Contribute
	</a>

	<a
		href="/user/{supabase.userProfile?.username}"
		onmousedown={() => goto(`/user/${supabase.userProfile?.username}`)}
		class="flex w-20 flex-col items-center text-center text-xs {page.url.pathname ===
		`/user/${supabase.userProfile?.username}`
			? 'text-blue-500'
			: ''}"
	>
		<img
			draggable="false"
			src={supabase.userProfile?.avatar_url}
			class="aspect-square w-[30px] rounded-full border object-cover drop-shadow-xl {page.url
				.pathname === `/user/${supabase.userProfile?.username}`
				? 'border-2 border-blue-500 drop-shadow-2xl'
				: 'border-border'}"
			alt=""
		/>
		Profile
	</a>
</div>

<style>
	.ios-safe-bottom {
		padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
	}
</style>
