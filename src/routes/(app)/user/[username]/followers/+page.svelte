<script lang="ts">
	import UserCard from '$lib/components/profile-card/user-card.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	let { data } = $props();
</script>

<a href="./" class="z-10 flex gap-2 h-20 items-center font-serif px-4 text-4xl lg:text-3xl font-medium">
    <ArrowLeft />
    <div>
        <img src={data.profile.avatar_url} class="w-8 aspect-square object-cover rounded-full" alt="">
    </div>
	Followers
</a>
<div class="p-4">
	{#each data.followerProfiles as follower}
		<UserCard profile={follower} />
	{/each}
</div>
