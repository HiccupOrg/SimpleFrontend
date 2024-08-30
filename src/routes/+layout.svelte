<script>
	import '../app.sass';
	import Background from '../components/Background.svelte';
	import { updateDarkModeTheme } from '$lib';

	updateDarkModeTheme();
</script>

<Background />
<slot></slot>
