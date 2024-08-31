<script lang="ts">
	import DarkModeSwitcher from '$lib/components/DarkModeSwitcher.svelte';
	import { Button } from 'bits-ui';
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center font-sans">
	<DarkModeSwitcher />
	<div class="m-3 flex flex-row">
		<Button.Root class="mx-3" on:click={() => goto('/login')}>登录</Button.Root>
		<Button.Root class="mx-3" on:click={() => goto('/register')}>注册</Button.Root>
	</div>
</div>

<style lang="sass">

</style>
