<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import CustomButton from '$lib/components/custom-button.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { afterNavigate, disableScrollHandling } from '$app/navigation';

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

<div
	class="mx-auto flex h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 p-4"
>
	<div class="flex max-w-screen-lg">
		<div class="flex w-[70%] flex-col gap-1 pt-10">
			<div class="font-serif text-5xl font-semibold">StageLog</div>
			<div class="text-xl">Log book for theatre lovers</div>
			<div class="h-1"></div>
			<CustomButton class="w-max" onclick={signIn}>Continue with Google</CustomButton>
		</div>
		<div class="relative w-full">
			<img src="/desktop.png" class="w-full rounded border border-border drop-shadow" alt="" />
			<div class="absolute -left-6 top-36">
				<img src="/timeline-phone.png" alt="" class="w-40" />
			</div>
		</div>
	</div>
</div>
<div class="flex justify-center py-20">
	<div class="flex w-full max-w-screen-lg justify-evenly">
		<div class="flex flex-col items-center gap-3">
			<img src="/show-page.png" class="w-48" alt="" />
			<div class="text-xl font-medium">See other's reviews</div>
		</div>
		<div class="flex flex-col items-center gap-3">
			<img src="/location.png" class="w-48" alt="" />
			<div class="text-xl font-medium">Choose locations</div>
		</div>
		<div class="flex flex-col items-center gap-3">
			<img src="/profile.png" class="w-48" alt="" />
			<div class="text-xl font-medium">Share your profile</div>
		</div>
	</div>
</div>
