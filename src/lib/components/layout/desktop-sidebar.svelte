<script>
	import { supabase } from '$lib/supabase/client.svelte';

	import { Heart, List, SquarePen, Users } from 'lucide-svelte';
	import CustomButton from '../custom-button.svelte';

	async function signIn() {
		await supabase.client?.auth.signInWithOAuth({
			provider: 'google'
		});
	}
</script>

<div class="sticky top-0 hidden h-screen min-w-72 border-r border-border px-4 pl-2 lg:block">
	{#if supabase.session}
		<div class="flex h-20 items-center py-4 font-serif text-4xl font-semibold">StageLog</div>
		<a href="/log" class="flex h-12 items-center gap-2 text-xl"><List size={24} /> Timeline</a>
		<!-- <a href="/wishlist" class="flex h-12 items-center gap-2 text-xl"><Heart size={24} /> Wishlist</a
		> -->
		<a href="/friends" class="flex h-12 items-center gap-2 text-xl"><Users size={24} /> Friends</a>
		<a href="/add" class="flex h-12 items-center gap-2 text-xl"><SquarePen size={24} /> Add Shows</a
		>
		<a href="/user/{supabase.userProfile?.username}" class="flex h-12 items-center gap-2 text-xl">
			<img
				src={supabase.userProfile?.avatar_url}
				class="w-[25px] rounded-full border border-border drop-shadow-xl"
				alt=""
			/>
			Profile</a
		>
	{:else}
		<div class="flex h-32 flex-col justify-center py-4">
			<div class="font-serif text-4xl font-semibold">StageLog</div>
			<div>Log book for theatre lovers</div>
		</div>
		<CustomButton onclick={signIn}>Sign In</CustomButton>
	{/if}
</div>
