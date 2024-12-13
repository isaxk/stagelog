<script lang="ts">
	import { cn } from '$lib/utils';

	let { url = '', path = '', class: className = '' } = $props();
</script>

<img
	src={url ??
		`https://ranmmdwcpccvoklpbaql.supabase.co/storage/v1/object/public/public-bucket/avatars/${path}`}
	alt="Avatar"
	class={cn('aspect-square object-cover', className)}
/>
