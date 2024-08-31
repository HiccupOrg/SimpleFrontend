<script lang="ts">
	import DarkModeSwitcher from '$lib/components/DarkModeSwitcher.svelte';
	import { Button } from 'bits-ui';
	import { goto } from '$app/navigation';
</script>

<div class="flex font-sans justify-center items-center flex-col">
	<DarkModeSwitcher />
	<div class="flex m-3 flex-row">
		<Button.Root class="mx-3" on:click={() => goto('/login')}>登录</Button.Root>
		<Button.Root class="mx-3" on:click={() => goto('/register')}>注册</Button.Root>
	</div>
</div>

<svelte:head>
	<title>Hiccup - Open source media transfer project</title>
</svelte:head>

<style lang="sass">

</style>
