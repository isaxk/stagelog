<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import CustomButton from '$lib/components/custom-button.svelte';
	import { supabase } from '$lib/supabase/client.svelte';

	$effect(() => {
		if (browser && supabase.user) {
			goto('/timeline');
		}
	});

	// using cdn
	// import glaze from "https://esm.sh/glazejs";
	// import gsap from "https://esm.sh/gsap";

	function signIn() {
		supabase.client?.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'https://localhost:5173/timeline'
			}
		});
	}
</script>

<div class="mx-auto flex h-screen max-w-screen-md items-center p-4">
	<div class="flex w-full flex-col items-center text-center">
		<div class="font-serif text-5xl font-semibold">StageLog</div>
		<div class="mb-4 text-xl">Log book for theatre lovers</div>
		<CustomButton onclick={signIn} class="w-max">Sign In With Google</CustomButton>
	</div>
</div>
