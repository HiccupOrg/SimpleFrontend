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

	export let channelItems: ChannelItem[];
	export let level = 1;
	export let meltContextName: string;

	const {
		elements: { item, group },
		helpers: { isSelected }
	} = getContext<TreeView>(meltContextName);
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
