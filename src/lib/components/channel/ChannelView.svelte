<script lang="ts">
	import { createTreeView } from '@melt-ui/svelte';
	import { setContext } from 'svelte';
	import ChannelTree, { type ChannelItem } from '$lib/components/channel/ChannelTree.svelte';

	export let meltContextName: string = 'channel-tree-view';

	const treeViewCtx = createTreeView({});
	setContext(meltContextName, treeViewCtx);

	const {
		elements: { tree }
	} = treeViewCtx;

	export let channelItems: ChannelItem[] = [];
</script>

<ul class="overflow-auto" {...$tree}>
	<ChannelTree {channelItems} {meltContextName}></ChannelTree>
</ul>
