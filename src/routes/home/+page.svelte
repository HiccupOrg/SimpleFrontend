<script lang="ts">
	import { browser } from '$app/environment';
	import { userLoggedIn } from '$lib/store';
	import { goto } from '$app/navigation';

	if (browser && !userLoggedIn()) {
		setTimeout(() => goto('/login'), 3000);
	}
</script>

<div class="flex items-center justify-center"></div>
