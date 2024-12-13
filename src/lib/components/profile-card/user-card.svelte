<script lang="ts">
	import type { Tables } from '$lib/supabase/types';

	let { profile }: { profile: Tables<'profiles'> } = $props();
</script>


<a href="/user/{profile.username}" class="flex rounded bg-white p-2 drop-shadow-lg gap-2 items-center">
	<img src={profile.avatar_url} alt="" class="aspect-square w-10 rounded-full" />
    <div class="text-lg font-medium">{profile.username}</div>
</a>
