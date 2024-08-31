<script lang="ts">
	import { Button } from 'bits-ui';
	import { getCurrentColorMode, updateDarkModeTheme } from '$lib/darkMode';
	import { IconBrightness2, IconHazeMoon } from '@tabler/icons-svelte';

	let colorMode = getCurrentColorMode();
	let clazz = '';

	export { clazz as class };

	function updateColorMode(newMode: 'light' | 'dark') {
		updateDarkModeTheme(newMode === 'dark');
		colorMode = newMode;
	}
</script>

<Button.Root
	class="h-fit w-fit bg-background p-0.5 {clazz}"
	on:click={() => updateColorMode(getCurrentColorMode() === 'dark' ? 'light' : 'dark')}
>
	<div id="theme-toggle" class="rounded-lg text-default hover:animate-pulse">
		{#if colorMode === 'dark'}
			<IconBrightness2 />
		{:else}
			<IconHazeMoon />
		{/if}
	</div>
</Button.Root>
