<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { Drawer } from 'vaul-svelte';
	import { MediaQuery } from 'svelte/reactivity';

	let {
		value = $bindable(0),
		small = false,
		profile = false,
		onchange = (v: number) => {}
	}: {
		value: number | null;
		small: boolean;
		profile: boolean;
		onchange?: (v: number) => void;
	} = $props();

	const sm = new MediaQuery('min-width: 640px');

	let hovered = $state(false);
	let drawer = $state(false);
</script>

<Drawer.Root bind:open={drawer}>
	<Drawer.Portal>
		<Drawer.Overlay
			class="fixed inset-0 z-50 bg-black/80 backdrop-blur-[1px] backdrop-saturate-50"
		/>
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-50 flex h-52 items-center justify-center rounded-t-lg bg-background"
		>
			{#each [1, 2, 3, 4, 5], i}
				<button
					class="outline-none"
					onclick={() => {
						if (sm) {
							if (profile) return;
							value = i;
							onchange(value);
						} else {
							drawer = true;
						}
					}}
					in:fade={{ duration: 300 }}
					><Star
						size={60}
						strokeWidth={2}
						color="#f59e0b"
						fill={(value ?? 0) > i ? '#f59e0b' : 'transparent'}
					/>
				</button>
			{/each}
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={['flex h-max items-center text-amber-500', small && 'h-20']}
	ontouchend={() => (drawer = true)}
	onmouseenter={() => (hovered = !profile)}
	onmouseleave={() => (hovered = false)}
>
	{#each Array(((hovered && sm.current) || !small) && !profile ? 5 : value), i (i)}
		<button
			onclick={() => {
				if (profile) return;
				value = i + 1;
				onchange(value);
			}}
			in:fade={{ duration: 300 }}
			animate:flip={{ duration: 350 }}
			><Star
				size={small ? 16 : 30}
				strokeWidth={2}
				fill={(value ?? 0) > i ? '#f59e0b' : 'transparent'}
			/>
		</button>
	{/each}
</div>
