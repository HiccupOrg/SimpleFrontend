<script context="module" lang="ts">
	import {
		IconCheese,
		IconDeviceTvOld,
		IconHomeOff,
		IconPhone,
		IconUserPin
	} from '@tabler/icons-svelte';

	type ItemType = 'joined' | 'voice' | 'video' | 'chat' | 'unjoinable';

	export interface ChannelItem {
		id: string;
		name: string;
		type: ItemType;

		children?: ChannelItem[];
	}

	export const ChannelIcons = {
		joined: IconUserPin,
		voice: IconPhone,
		video: IconDeviceTvOld,
		chat: IconCheese,
		unjoinable: IconHomeOff
	};
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { melt, type TreeView } from '@melt-ui/svelte';
	import { getDefaultMicrophone, mediaContext } from '$lib/media';
	import { infoToast } from '$lib/components/toast/Toaster.svelte';
	import { get } from 'svelte/store';

	export let channelItems: ChannelItem[];
	export let level = 1;
	export let meltContextName: string;

	const {
		elements: { item, group },
		helpers: { isSelected }
	} = getContext<TreeView>(meltContextName);

	function createJoinChannelHandler(channelId: string) {
		return async () => {
			await mediaContext.refresh();
			let context = get(mediaContext);
			if (context.error !== null || context.data === null) {
				infoToast('Device error', 'Failed to create media device');
				return;
			}

			try {
				await context.data.initialize(channelId);
				await context.data.createAudioProducer();
			} catch (error) {
				console.error(error);
				infoToast('Device error', 'Failed to initialize media device');
				return;
			}
		};
	}
</script>

{#each channelItems as { id, name, type, children } (id)}
	{@const hasChildren = !!children?.length}

	<li class="{level !== 1 ? 'pl-4' : ''} select-none text-default">
		<button
			class="flex items-center gap-1 rounded-md p-1 focus:bg-primary/50"
			use:melt={$item({
				id,
				hasChildren
			})}
			on:click={createJoinChannelHandler(id)}
		>
			<svelte:component this={ChannelIcons[type]} class="h-4 w-4" />

			<span>{name}</span>

			{#if $isSelected(id)}
				<svelte:component this={ChannelIcons['joined']} class="h-4 w-4" />
			{/if}
		</button>

		{#if children}
			<ul use:melt={$group({ id })}>
				<svelte:self channelItems={children} level={level + 1} />
			</ul>
		{/if}
	</li>
{/each}
