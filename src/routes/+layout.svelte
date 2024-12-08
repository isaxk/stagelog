<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { supabase } from '$lib/supabase/client.svelte';
	let { children, data } = $props();

	supabase.client = data.supabase;
	supabase.session = data.session;

	onMount(() => {
		if (supabase.client) {
			supabase.client.auth.getUser().then((user) => {
				if (user.data) {
					supabase.client
						?.from('profiles')
						.select('*')
						.eq('id', user.data.user?.id)
						.then(({ data }) => {
							supabase.userProfile = data ? data[0] : null;
						});
				}
			});

			const { data } =
				supabase.client?.auth.onAuthStateChange(async (event, newSession) => {
					// if (newSession?.expires_at !== supabase.session?.expires_at) {
					// 	invalidate('supabase:auth');
					// }
					supabase.user = newSession?.user ?? null;
					supabase.client
						?.from('profiles')
						.select('*')
						.eq('id', supabase.user?.id)
						.then(({ data }) => {
							supabase.userProfile = data ? data[0] : null;
						});
				}) ?? null;

			return () => data.subscription.unsubscribe();
		}
	});
</script>

{@render children()}
