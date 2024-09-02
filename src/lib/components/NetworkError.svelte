<script lang="ts">
	import { IconNetworkOff } from '@tabler/icons-svelte';
</script>

<div class="flex select-none items-center text-default">
	<IconNetworkOff />
	<p class="my-3 text-sm"><slot /></p>
</div>
