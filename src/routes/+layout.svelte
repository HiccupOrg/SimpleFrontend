<script>
	import '../app.sass';
	import Background from '../components/Background.svelte';
	import { updateDarkModeTheme } from '$lib';

	export const prerender = true;
	export const trailingSlash = true;

	updateDarkModeTheme();
</script>

<Background/>
<slot></slot>
