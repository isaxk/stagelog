<script lang="ts">
	import { Heart, List, SquarePen, Users } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import AddShows from '../../../routes/(app)/add/+page.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { preloadData } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<div
	class="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-evenly bg-white drop-shadow lg:hidden"
>
	<a
		href="/log"
		class="flex w-20 flex-col items-center text-center text-xs {$page.url.pathname === '/log'
			? 'text-blue-500'
			: ''}"
	>
		<List size={28} />
	</a>

	<a
		href="/friends"
		class="flex w-20 flex-col items-center text-center text-xs {$page.url.pathname === '/friends'
			? 'text-blue-500'
			: ''}"
	>
		<Users size={28} />
	</a>

	<a
		href="/user/{supabase.userProfile?.username}"
		class="flex w-20 flex-col items-center text-center text-xs"
	>
		<img
			src={supabase.userProfile?.avatar_url}
			class="w-[36px] rounded-full border drop-shadow-xl {$page.url.pathname ===
			`/user/${supabase.userProfile?.username}`
				? 'border-2 border-blue-500 drop-shadow-2xl'
				: 'border-border'}"
			alt=""
		/>
	</a>
</div>
