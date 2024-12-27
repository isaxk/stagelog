<script lang="ts">
	import { goto } from '$app/navigation';
	import CustomButton from '$lib/components/custom-button.svelte';
	import DesktopQuery from '$lib/components/layout/desktop-query.svelte';
	import LogListItem from '$lib/components/log-list/log-list-item.svelte';
	import LogListYear from '$lib/components/log-list/log-list-year.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ImageUploader from '$lib/components/ui/image-uploader/image-uploader.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { groupByYear } from '$lib/utils/array';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { scrollY } from 'svelte/reactivity/window';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { Drawer } from 'vaul-svelte';

	let { data } = $props();

	let usernameValue = $state(data.profile.username);
	let bioValue = $state(data.profile.bio);
	let bio = $state(data.profile.bio);
	let following = $state(data.isUserFollowing);
	let avatarUrl = $state(data.profile.avatar_url);
	let newAvatar = $state(null);
	let editProfileOpen = $state(false);

	const timeline = groupByYear(data.timeline, data.shows);

	let mounted = $state(false);
	onMount(() => (mounted = true));

	async function updateProfile() {
		editProfileOpen = false;
		let newAvatarUrl = data.profile.avatar_url;
		const id = Date.now();
		if (newAvatar) {
			await supabase.client!.storage.from('avatars').remove([data.profile.avatar_url]);

			await supabase
				.client!.storage.from('avatars')
				.upload(`/${supabase.user?.id}/profile_avatar_${id}.jpg`, newAvatar, {
					cacheControl: '100',
					upsert: true
				});

			const newUrl = supabase
				.client!.storage.from('avatars')
				.getPublicUrl(`/${supabase.user?.id}/profile_avatar_${id}.jpg`);
			newAvatarUrl = newUrl.data.publicUrl;
		}
		const response = await supabase
			.client!.from('profiles')
			.update({ username: usernameValue, bio: bioValue, avatar_url: newAvatarUrl })
			.eq('id', data.session?.user.id)
			.select();
		if (data.profile.username !== usernameValue) {
			goto('/user/' + usernameValue);
		}

		avatarUrl = newAvatarUrl;
		bio = bioValue;
		console.log(response);
	}

	async function follow() {
		const { error } = await supabase.client!.from('follows').insert({ following: data.profile.id });
		following = error ? false : true;
	}
	async function unfollow() {
		const { error } = await supabase
			.client!.from('follows')
			.delete()
			.eq('follower', supabase.user?.id)
			.eq('following', data.profile.id);
		following = error ? true : false;
	}
</script>

<svelte:head>
	<title>{data.profile.username} - StageLog</title>
</svelte:head>

{#snippet infos()}
	<div class="flex flex-grow flex-col pt-0">
		<div class="text-3xl font-semibold">{data.profile?.username}</div>
		<div class="flex gap-4 text-sm font-light">
			<a href="/user/{data.profile?.username}/following">
				<span class="font-medium">{data.following.length}</span> following</a
			>
			<a href="/user/{data.profile?.username}/followers">
				<span class="font-medium">{data.followers.length}</span>
				followers</a
			>
			<div><span class="font-medium">{data.timeline.length}</span> shows</div>
		</div>
	</div>
{/snippet}

{#snippet profileEditor()}
	<div class="relative flex items-center gap-4 pt-4">
		<ImageUploader
			defaultSrc={data.profile.avatar_url}
			bind:file={newAvatar}
			class="h-32 w-32 min-w-32 rounded-full"
		/>
		<div class="w-full">
			<div class="font-medium">Username</div>
			<input
				class="w-full rounded border border-border bg-card p-3 drop-shadow"
				type="text"
				bind:value={usernameValue}
			/>
		</div>
	</div>
	<div>
		<div class="font-medium">Bio</div>
		<Textarea bind:value={bioValue} />
	</div>
{/snippet}

<div class="contents sm:hidden">
	{#if (scrollY.current ?? 0) > 50}
		<div
			transition:fade={{ duration: 150 }}
			class="fixed left-0 right-0 top-0 z-50 flex min-h-20 w-full items-center justify-center border-b border-border bg-background p-4 pb-3 pt-ios-top drop-shadow"
		>
			<div class="text-lg font-semibold">{data.profile.username}</div>
		</div>
	{/if}
</div>
{#if (scrollY.current ?? 0) < 0}
	<div class="fixed left-0 right-0 top-0 -z-10 h-[500px] bg-blue-200 lg:hidden">
		{scrollY.current}
	</div>
{/if}
<div class="z-20">
	<div class="relative top-0 flex h-60 w-full flex-col gap-4 bg-background lg:h-52">
		<div class="min-h-32 bg-blue-200"></div>
		<div class="absolute left-0 top-[76px] flex justify-center lg:top-24">
			<div class="flex w-full max-w-screen-md gap-4 px-4">
				<img
					src={avatarUrl}
					alt=""
					class="aspect-square w-28 rounded-full border-2 border-white object-cover drop-shadow-xl"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-4 pl-36 pr-4 lg:flex-row lg:items-center">
			<div class="hidden flex-grow lg:block">
				{@render infos()}
			</div>
			<div class="flex justify-end">
				{#if mounted}
					{#if data.profile?.id === data.session?.user.id && mounted}
						<DesktopQuery query="(max-width: 1024px)">
							{#snippet unmatch()}
								<Dialog.Root bind:open={editProfileOpen}>
									<Dialog.Trigger class="hidden lg:block"
										><CustomButton onclick={() => {}} class="w-max px-6 py-2 text-sm"
											>Edit Profile</CustomButton
										></Dialog.Trigger
									>
									<Dialog.Content class="bg-background">
										<Dialog.Header>
											<Dialog.Title>Edit Profile</Dialog.Title>
										</Dialog.Header>
										{@render profileEditor()}
										<div class="flex h-12 items-center justify-center text-lg">
											<CustomButton
												onclick={() => {
													toast.promise(updateProfile(), {
														loading: 'Loading...',
														success: () => {
															return `Profile Updated`;
														},
														error: 'Error'
													});
												}}>Done</CustomButton
											>
										</div>
									</Dialog.Content>
								</Dialog.Root>
							{/snippet}
							{#snippet match()}
								<Drawer.Root shouldScaleBackground bind:open={editProfileOpen}>
									<Drawer.Trigger>
										<CustomButton onclick={() => {}} class="w-max px-6 py-2 text-sm"
											>Edit Profile</CustomButton
										>
									</Drawer.Trigger>
									<Drawer.Portal>
										<Drawer.Overlay class="fixed inset-0 bg-black/60 backdrop-blur-[1px]" />
										<Drawer.Content
											class="fixed bottom-0 left-0 right-0 z-20 flex h-drawer flex-col rounded-t-lg bg-background outline-none"
										>
											<div
												class="z-20 flex h-16 items-center justify-center rounded-t-lg bg-muted p-4 drop-shadow"
											>
												<div class="flex w-full max-w-screen-sm items-center">
													<Drawer.Close class="w-20 py-4 text-left text-blue-400"
														>Cancel</Drawer.Close
													>
													<div class="flex-grow text-center font-semibold">Edit Profile</div>
													<button
														onclick={() => {
															toast.promise(updateProfile(), {
																loading: 'Loading...',
																success: () => {
																	return `Profile Updated`;
																},
																error: 'Error'
															});
														}}
														class="w-20 text-right font-medium {usernameValue ===
															data.profile.username &&
														bioValue === data.profile.bio &&
														newAvatar === null
															? 'text-zinc-700'
															: 'text-blue-500'}"
														disabled={usernameValue === data.profile.username &&
															bioValue === data.profile.bio &&
															newAvatar === null}>Done</button
													>
												</div>
											</div>
											<div class="p-4">
												{@render profileEditor()}
											</div></Drawer.Content
										>
									</Drawer.Portal>
								</Drawer.Root>
							{/snippet}
						</DesktopQuery>
					{:else if following}
						<CustomButton onclick={unfollow} class="w-max px-6 py-2 text-sm">Unfollow</CustomButton>
					{:else}
						<CustomButton onclick={follow} class="w-max px-6 py-2 text-sm">Follow</CustomButton>
					{/if}
				{/if}
			</div>
		</div>
		<div class="block pl-4 lg:hidden">
			{@render infos()}
		</div>
	</div>
	<div class="z-20 mt-6 px-4 lg:mt-4">
		{bio}
	</div>
	<div class="pt-4 lg:p-4">
		<div
			class="min-h-96 border-t border-border bg-background p-4 lg:rounded-md lg:border-x lg:drop-shadow-sm"
		>
			{#each timeline as year}
				<LogListYear {year}>
					{#each year.items as item, i}
						<divs
							class={cn('h-[72px] min-h-[72px]', {
								'h-[105px] lg:h-[72px]': item.log_entry.comments,
								'h-[100px] lg:h-[72px]': !item.log_entry.comments
							})}
						>
							<LogListItem {i} {item} profile={data.profile} />
						</divs>
					{/each}
				</LogListYear>
			{/each}
		</div>
	</div>
	<div class="h-20 lg:h-0"></div>
</div>
