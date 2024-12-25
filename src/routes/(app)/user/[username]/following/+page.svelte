<script lang="ts">
	import UserCard from '$lib/components/profile-card/user-card.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { scrollY } from 'svelte/reactivity/window';

	let { data } = $props();
</script>

<div
	class="sticky top-0 z-10 flex min-h-20 items-center gap-2 bg-background p-4 pt-ios-top font-serif font-medium transition-all duration-300 lg:text-3xl {(scrollY.current ??
		0) > 50
		? 'border-b border-border text-3xl drop-shadow-md sm:drop-shadow-none'
		: 'text-4xl'}"
>
	<a href="./" class="flex items-center gap-2 pt-2">
		<ArrowLeft />
		<div>
			<img
				src={data.profile.avatar_url}
				class="aspect-square rounded-full object-cover transition-all {(scrollY.current ?? 0) > 50
					? 'w-7'
					: 'w-8'}"
				alt=""
			/>
		</div>
		Following
	</a>
</div>
<div class="flex flex-col gap-2 p-4">
	{#await data.followerProfiles}
		{#each data.following}
			<Skeleton class="h-[60px]" />
		{/each}
	{:then profiles}
		{#each profiles as follower}
			<UserCard profile={follower} />
		{/each}
	{/await}
</div>
