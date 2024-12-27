<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import { resetMode, setMode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Moon, Sun } from 'lucide-svelte';
	import SettingsItem from '$lib/components/settings/settings-item.svelte';
	import CustomButton from '$lib/components/custom-button.svelte';
	import { supabase } from '$lib/supabase/client.svelte';

	function signOut() {
		supabase.client!.auth.signOut();
	}
</script>

<Page title="Settings">
	<div class="flex flex-col gap-2">
		<SettingsItem label="Theme">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</SettingsItem>
		<CustomButton
			onclick={signOut}
			class="w-max border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/70"
			>Sign Out</CustomButton
		>
	</div>
</Page>
