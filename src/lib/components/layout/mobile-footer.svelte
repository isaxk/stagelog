<script lang="ts">
	import { Heart, List, SquarePen, Users } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { preloadData } from '$app/navigation';
	import { page } from '$app/stores';

	let preloadedData: any = $state(null);

	function preloadDrawerData() {
		preloadData('/add').then((result) => {
			if (result.type === 'loaded') {
				preloadedData = result.data;
			}
		});
	}
</script>

<div
	class="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-evenly bg-white drop-shadow lg:hidden"
>
	<a
		href="/timeline"
		class="flex w-20 flex-col items-center text-center text-xs {$page.url.pathname === '/timeline'
			? 'text-blue-500'
			: ''}"
	>
		<List size={28} />
	</a>

	<a
		href="/log"
		class="flex w-20 flex-col items-center text-center text-xs {$page.url.pathname === '/log'
			? 'text-blue-500'
			: ''}"
	>
		<SquarePen size={28} />
	</a>

	<a
		href="/contribute"
		class="flex w-20 flex-col items-center text-center text-xs {$page.url.pathname === '/contribute'
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
			class="w-[36px] aspect-square object-cover rounded-full border drop-shadow-xl {$page.url.pathname ===
			`/user/${supabase.userProfile?.username}`
				? 'border-2 border-blue-500 drop-shadow-2xl'
				: 'border-border'}"
			alt=""
		/>
	</a>
</div>
