<script>
	import { Button } from 'bits-ui';
</script>

<div class="flex h-screen flex-row flex-nowrap">
	<div class="left-image h-screen basis-1/3"></div>
	<div class="flex h-screen basis-2/3 content-center items-center justify-center bg-background">
		<Button.Root class="w-1/3">测试</Button.Root>
	</div>
</div>

<style lang="scss">
	.left-image {
		background-size: cover;
		background-image: url('/assets/images/LoginBackground.jpeg');
	}
</style>
