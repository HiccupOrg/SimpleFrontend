<script>
	import '../app.sass';
	import Background from '$lib/components/Background.svelte';
	import { updateDarkModeTheme } from '$lib';
	import Toaster from '$lib/components/toast/Toaster.svelte';
	import { page } from '$app/stores';

	updateDarkModeTheme();
</script>

<Background />
<Toaster />
<slot></slot>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>
