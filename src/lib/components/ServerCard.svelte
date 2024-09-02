<script lang="ts">
	import { Button } from 'bits-ui';

	export let serverName = 'Default Server';
	export let serverId: string;
</script>

<section>
	<div class="rounded-md bg-secondary-100/80 px-4 pb-2 pt-4 text-default shadow">
		<h3 class="mb-3 text-base font-semibold">{serverName}</h3>
		<p class="text-sm">Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
		<div class="flex-1 text-right">
			<a href="/home/server/{serverId}">
				<Button.Root class="my-2 h-6 bg-secondary text-sm">Connect</Button.Root>
			</a>
		</div>
	</div>
</section>
