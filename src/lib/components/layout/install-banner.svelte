<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';

	import step1 from '$lib/assets/install-guide/share.jpg';
	import step2 from '$lib/assets/install-guide/addtohomescreen.jpg';
	import step3 from '$lib/assets/install-guide/final.jpg';
	import { onMount } from 'svelte';

	function getPWADisplayMode() {
		if (document.referrer.startsWith('android-app://')) return 'twa';
		if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
		if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
		if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
		if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
		if (window.matchMedia('(display-mode: window-controls-overlay)').matches)
			return 'window-controls-overlay';

		return 'unknown';
	}

	let ios = $state(false);
	onMount(() => {
		function iOS() {
			return (
				['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
					navigator.platform
				) ||
				// iPad on iOS 13 detection
				(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
			);
		}
		ios = iOS() && getPWADisplayMode() !== 'standalone';
	});
</script>

{#if ios}
	<Drawer.Root shouldScaleBackground>
		<Drawer.Trigger
			class="-mt-4 mb-4 flex h-14 w-full items-center gap-4 rounded-lg bg-black px-4 text-left text-white drop-shadow dark:bg-zinc-200 dark:text-black"
		>
			<Download />
			<div class="flex-grow text-xl">Install App</div>
			<div class="rounded-full bg-white px-4 py-1 text-black dark:bg-black/80 dark:text-white">
				Install
			</div>
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/80 backdrop-blur-[1px] backdrop-saturate-50" />
			<Drawer.Content class="fixed bottom-0 left-0 right-0 z-40 h-[95%] rounded-t-lg bg-background">
				<div
					class="z-20 flex h-16 items-center justify-center rounded-t-lg bg-muted p-4 drop-shadow"
				>
					<Drawer.Close class="w-20 py-4 text-left text-blue-400">Cancel</Drawer.Close>
					<div class="flex w-full max-w-screen-sm items-center">
						<div class="flex-grow text-center font-semibold">Install App</div>
					</div>
					<div class="w-20"></div>
				</div>
				<div class="flex flex-col gap-8 p-4 font-medium">
					<div class="flex items-center">
						<div class="flex-grow text-lg">1. Press the share button</div>
						<img src={step1} alt="Share button" class="w-1/2 drop-shadow" />
					</div>
					<div class="flex items-center">
						<div class="flex-grow text-lg">2. Scroll down and select "Add to home screen"</div>
						<img src={step2} class="w-1/2 drop-shadow" alt="Step2" />
					</div>
					<div class="flex items-center">
						<div class="flex-grow text-lg">3. Select Add</div>
						<img src={step3} class="w-1/2 drop-shadow" alt="Step3" />
					</div>
				</div>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{/if}
