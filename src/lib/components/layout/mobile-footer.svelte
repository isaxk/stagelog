<script lang="ts">
	import { type Icon as IconType, List, PlusCircle, Search } from 'lucide-svelte';
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

{#snippet tab(label: string, href: string, Icon: typeof IconType)}
	<a
		{href}
		onmousedown={() => goto(href)}
		class={[
			'flex w-20 flex-col items-center text-center text-xs',
			page.url.pathname === href && 'text-blue-500'
		]}
	>
		<Icon size={28} />
		{label}
	</a>
{/snippet}
<div
	class="fixed bottom-0 left-0 right-0 flex min-h-14 items-center justify-evenly border-t border-border bg-card py-3 pb-ios-bottom text-accent-foreground drop-shadow lg:hidden"
>
	{#if navigating.type}
		<div
			class="absolute left-0 right-0 top-0 z-[1000] h-0.5 animate-pulse bg-blue-500 drop-shadow duration-1000 sm:top-0"
		></div>
	{/if}

	{@render tab('Timeline', '/timeline', List)}

	{@render tab('Find Shows', '/log', Search)}

	{@render tab('Contribute', '/contribute', PlusCircle)}

	<a
		href="/user/{supabase.userProfile?.username}"
		onmousedown={() => goto(`/user/${supabase.userProfile?.username}`)}
		class={[
			'flex w-20 flex-col items-center text-center text-xs',
			page.url.pathname === `/user/${supabase.userProfile?.username}` && 'text-blue-500'
		]}
	>
		<img
			draggable="false"
			src={supabase.userProfile?.avatar_url}
			class={[
				'aspect-square w-[30px] rounded-full border object-cover drop-shadow-xl',
				page.url.pathname === `/user/${supabase.userProfile?.username}`
					? 'border-2 border-blue-500 drop-shadow-2xl'
					: 'border-border'
			]}
			alt=""
		/>
		Profile
	</a>
</div>
