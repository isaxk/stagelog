<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CustomButton from '$lib/components/custom-button.svelte';
	import { supabase } from '$lib/supabase/client.svelte';

	$effect(() => {
		if (browser && supabase.user) {
			goto('/timeline');
		}
	});

	function signIn() {
		supabase.client?.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'https://localhost:5173/timeline'
			}
		});
	}
</script>

<div class="mx-auto flex max-w-screen-md items-center p-4 h-screen">
	<div class="text-center flex flex-col items-center w-full">
		<div class="font-serif text-5xl font-semibold">StageLog</div>
		<div class="text-xl mb-4">Log book for theatre lovers</div>
		<CustomButton onclick={signIn} class="w-max"> Sign In With Google</CustomButton>
	</div>
</div>
