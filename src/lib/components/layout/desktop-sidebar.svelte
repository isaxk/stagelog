<script lang="ts">
	import { supabase } from '$lib/supabase/client.svelte';

	import { List, Search, Settings, Users } from 'lucide-svelte';
	import CustomButton from '../custom-button.svelte';
	import SidebarItem from './sidebar-item.svelte';

	async function signIn() {
		await supabase.client?.auth.signInWithOAuth({
			provider: 'google'
		});
	}
</script>

<div class="sticky top-0 hidden h-screen min-w-72 flex-col px-4 pb-4 pl-2 lg:flex">
	{#if supabase.session}
		<div class="flex h-20 items-center py-4 font-serif text-4xl font-semibold">StageLog</div>

		<SidebarItem href="/timeline" label="Timeline">
			{#snippet icon(size: number, weight: number)}
				<List {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem>
		<!-- <SidebarItem href="/wishlist" label="Wishlist">
			{#snippet icon(size: number, weight: number)}
				<Heart {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem> -->
		<!-- <SidebarItem href="/friends" label="Following">
			{#snippet icon(size: number, weight: number)}
				<Users {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem> -->
		<SidebarItem href="/log" label="Find Shows">
			{#snippet icon(size: number, weight: number)}
				<Search {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem>
		<SidebarItem href="/contribute" label="Contibute">
			{#snippet icon(size: number, weight: number)}
				<Users {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem>
		<SidebarItem href="/user/{supabase.userProfile?.username}" label="Profile">
			{#snippet icon()}
				<img
					src={supabase.userProfile?.avatar_url}
					class="-mr-1 aspect-square w-[28px] -translate-x-[3px] rounded-full border border-border object-cover drop-shadow-xl"
					alt=""
				/>
			{/snippet}
		</SidebarItem>
		<SidebarItem href="/settings" label="Settings">
			{#snippet icon(size: number, weight: number)}
				<Settings {size} strokeWidth={weight} />
			{/snippet}
		</SidebarItem>
	{:else}
		<div class="flex h-32 flex-col justify-center py-4">
			<div class="font-serif text-4xl font-semibold">StageLog</div>
			<div>Log book for theatre lovers</div>
		</div>
		<CustomButton onclick={signIn}>Sign In</CustomButton>
	{/if}
</div>
