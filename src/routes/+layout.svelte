<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client.svelte';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';

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
					supabase
						.client!.channel('profile-updates')
						.on(
							'postgres_changes',
							{
								event: 'UPDATE',
								schema: 'public',
								table: 'profiles',
								filter: `id=eq.${user.data.user?.id}`
							},
							(payload) => {
								console.log(payload);
								console.log('test');
								supabase.userProfile = payload.new[0] ?? payload.new;
							}
						)
						.subscribe();
				}
			});

			const { data } =
				supabase.client?.auth.onAuthStateChange(async (event, newSession) => {
					// if (newSession?.expires_at !== supabase.session?.expires_at) {
					// 	invalidate('supabase:auth');
					// }
					if (!newSession?.user) goto('/');
					supabase.user = newSession?.user ?? null;
					supabase.client
						?.from('profiles')
						.select('*')
						.eq('id', supabase.user?.id)
						.then(({ data }) => {
							supabase.userProfile = data ? data[0] : null;
						});
					supabase
						.client!.channel('profile-updates')
						.on(
							'postgres_changes',
							{
								event: 'UPDATE',
								schema: 'public',
								table: 'profiles',
								filter: `id=eq.${supabase.user?.id}`
							},
							(payload) => {
								console.log(payload);
								console.log('test');
								supabase.userProfile = payload.new[0] ?? payload.new;
							}
						)
						.subscribe();
				}) ?? null;

			return () => data.subscription.unsubscribe();
		}
	});
</script>

<ModeWatcher />

{@render children()}
