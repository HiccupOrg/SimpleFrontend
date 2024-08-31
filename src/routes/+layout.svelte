<script>
	import '../app.sass';
	import Background from '$lib/components/Background.svelte';
	import { updateDarkModeTheme } from '$lib';
	import Toaster from '$lib/components/toast/Toaster.svelte';

	updateDarkModeTheme();
</script>

<Background />
<Toaster />
<slot></slot>
