<script lang="ts">
	import { cn } from '$lib/utils';
import { Upload } from 'lucide-svelte';

	let { class: className = '', defaultSrc = '', file = $bindable(null) } = $props();

	let imgSrc: string | null = $state(defaultSrc);

	$effect(()=>{
		if(!file) imgSrc = defaultSrc ?? null;
	})
</script>

<input
	type="file"
	hidden
	accept="image/png, image/jpeg, image/webp"
	id="upload-btn"
	onchange={(evt) => {
		//@ts-ignore;
		const [f] = evt.target!.files;
		if (f) {
			file=f;
			imgSrc = URL.createObjectURL(f);
		}
		else {
			imgSrc = null;
		}
	}}
/>
<div class={cn('relative aspect-square h-40 min-w-40 rounded-lg bg-zinc-300 overflow-hidden border border-white drop-shadow', className)}>
	{#if imgSrc}
		<img src={imgSrc} alt="" class="absolute inset-0 aspect-square object-cover w-full h-full" />
	{/if}
	<label
		for="upload-btn"
		class="absolute inset-0 flex items-center justify-center hover:cursor-pointer"
	>
		<div class="rounded bg-zinc-50/60 p-3 drop-shadow backdrop-blur">
			<Upload class="drop-shadow" />
		</div>
	</label>
</div>
