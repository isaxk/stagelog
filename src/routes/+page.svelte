<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import CustomButton from "$lib/components/custom-button.svelte";
	import { supabase } from "$lib/supabase/client.svelte";

	$effect(()=>{
		if(browser && supabase.user) {
			goto('/timeline')
		}
	})

	function signIn() {
		supabase.client?.auth.signInWithOAuth({
			provider: 'google'
		})
	}
	
</script>

<div class="max-w-screen-md mx-auto p-4">
	<CustomButton onclick={signIn} class="w-max">Sign In With Google</CustomButton>
</div>
