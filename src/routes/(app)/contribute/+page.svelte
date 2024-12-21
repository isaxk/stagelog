<script lang="ts">
	import CustomButton from '$lib/components/custom-button.svelte';
	import Page from '$lib/components/page/page.svelte';
	import ImageUploader from '$lib/components/ui/image-uploader/image-uploader.svelte';
	import { supabase } from '$lib/supabase/client.svelte';
	import { Check, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let selectedFile = $state(null);
	let name: string | null = $state(null);
	let playwright: string | null = $state(null);
	let category: string | null = $state(null);

	async function handleSubmit() {
		toast.promise(
			async () => {
				if (
					!selectedFile ||
					!name ||
					name.length < 2 ||
					!playwright ||
					playwright.length < 2 ||
					!category ||
					category.length < 2
				) {
					throw 'Incomplete data';
				}

				const path = `/public/${name}_${Date.now()}.jpg`;
				const storage = await supabase.client?.storage
					.from('show_images')
					.upload(path, selectedFile);
				console.log(storage);
				const { data } = supabase.client!.storage.from('show_images').getPublicUrl(path);
				await supabase
					.client!.from('shows')
					.insert([{ name, playwright, tags: [category], image_url: data.publicUrl }])
					.select('*');
				selectedFile = null;

				name = null;
				playwright = null;
				category = null;
			},
			{
				loading: 'Loading...',
				success: () => 'Submitted. Review process is underway.',
				error: 'Error'
			}
		);
	}
</script>

<Page title="Contribute">
	<form onsubmit={(e) => e.preventDefault}>
		<div class="flex gap-4">
			<ImageUploader bind:file={selectedFile} />
			<div class="flex w-full flex-col gap-2">
				<div>
					<div>Show name:</div>
					<input
						type="text"
						bind:value={name}
						class="w-full rounded border p-3 text-xl drop-shadow"
						placeholder="Hamilton: An American Musical"
					/>
				</div>
				<div>
					<div class="text-sm">Playwright:</div>
					<input
						type="text"
						bind:value={playwright}
						class="w-full rounded border px-2 py-1 text-sm drop-shadow"
						placeholder="Lin-Manuel Miranda"
					/>
				</div>
				<div>
					<div class="text-sm">Catagory:</div>
					<input
						type="text"
						bind:value={category}
						class="w-full rounded border px-2 py-1 text-sm drop-shadow"
						placeholder="musical"
					/>
				</div>
			</div>
		</div>
		<div class="h-6"></div>
		<div class="rounded border border-border bg-background p-4 drop-shadow-sm">
			<div class="pb-4 font-semibold">Rules:</div>
			<ul class="flex flex-col gap-1">
				<li class="flex items-center gap-1"><Check size={15} /> Must not already be listed</li>
				<li class="flex items-center gap-1">
					<Check size={15} /> Must be real
				</li>
				<li class="flex items-center gap-1">
					<Check size={15} /> Information should be accurate
				</li>
			</ul>
		</div>
		<div class="h-4"></div>
		<div class="rounded border border-border bg-background p-4 drop-shadow-sm">
			<div class="pb-4 font-semibold">Moderation Notice:</div>
			<div>
				Submissions are subject to moderation. Once your contribution has been submitted it will be
				held for manual review.
			</div>
			<div class="text-md pt-2 font-medium">While your submission is under review it:</div>
			<ul class="flex flex-col gap-1 py-2">
				<li class="flex items-center gap-1">
					<Check size={15} /> Can be added to your own timeline
				</li>
				<li class="flex items-center gap-1">
					<X size={15} /> Will not be visibile on your timeline by other users
				</li>
				<li class="flex items-center gap-1"><X size={15} /> Will not appear in search results</li>
			</ul>
			<div class="pt-2">Thanks for your patience :)</div>
		</div>
		<div class="h-6"></div>
		<CustomButton onclick={handleSubmit} type="submit">Submit</CustomButton>
	</form></Page
>
