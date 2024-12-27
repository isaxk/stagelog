<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';
	import { page } from '$app/state';

	import { List, PlusCircle, Search, Settings, type Icon as IconType } from 'lucide-svelte';
	import CustomButton from '../custom-button.svelte';
	import { type Snippet } from 'svelte';

	async function signIn() {
		await supabase.client?.auth.signInWithOAuth({
			provider: 'google'
		});
	}
</script>

{#snippet item(
	href: string,
	label: string,
	Icon?: typeof IconType | null,
	custom?: Snippet<[boolean]>
)}
	<a
		{href}
		class={[
			'flex h-12 items-center gap-2 text-xl transition-all',
			page.url.pathname === href && 'font-semibold'
		]}
		>{#if Icon}<Icon
				size={24}
				strokeWidth={page.url.pathname === href ? 2.5 : 1.5}
			/>{:else if custom}
			{@render custom(page.url.pathname === href)}
		{/if}
		{label}</a
	>
{/snippet}

<div class="sticky top-0 hidden h-screen min-w-72 flex-col px-4 pb-4 pl-2 lg:flex">
	{#if supabase.session}
		<div class="flex h-20 items-center py-4 font-serif text-4xl font-semibold">StageLog</div>

		{@render item('/timeline', 'Timeline', List)}
		{@render item('/log', 'Find Shows', Search)}
		{@render item('/contribute', 'Contribute', PlusCircle)}

		{#snippet custom(active: boolean)}
			<img
				src={supabase.userProfile?.avatar_url}
				class={[
					'-mr-0.5 box-border aspect-square w-[28px] -translate-x-[3px] rounded-full border object-cover transition-all',
					active ? 'border-foreground drop-shadow-xl' : 'border-border'
				]}
				alt=""
			/>
		{/snippet}
		{@render item(`/user/${supabase.userProfile?.username}`, 'Profile', null, custom)}

		{@render item('/settings', 'Settings', Settings)}
	{:else}
		<div class="flex h-32 flex-col justify-center py-4">
			<div class="font-serif text-4xl font-semibold">StageLog</div>
			<div>Log book for theatre lovers</div>
		</div>
		<CustomButton onclick={signIn}>Sign In</CustomButton>
	{/if}
</div>
