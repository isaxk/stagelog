<script lang="ts">
	import type { Tables } from '$lib/supabase/types';
	import { fade } from 'svelte/transition';

	let { profile }: { profile: Tables<'profiles'> } = $props();
</script>

<a
	in:fade={{ duration: 200 }}
	href="/user/{profile.username}"
	class="flex items-center gap-2 rounded border border-border bg-card p-2 drop-shadow"
>
	<img src={profile.avatar_url} alt="" class="aspect-square w-10 rounded-full" />
	<div class="text-lg font-medium">{profile.username}</div>
</a>
