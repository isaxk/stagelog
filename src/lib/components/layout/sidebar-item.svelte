<script lang="ts">
	import { page } from '$app/state';

	let { href, label, icon } = $props();
</script>

<a
	{href}
	class={[
		'flex h-12 items-center gap-2 text-xl transition-all',
		page.url.pathname === href && 'font-semibold'
	]}>{@render icon(24, page.url.pathname === href ? 2.5 : 1.5)} {label}</a
>
