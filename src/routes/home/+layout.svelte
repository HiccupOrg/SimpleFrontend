<script lang="ts">
	import DarkModeSwitcher from '$lib/components/DarkModeSwitcher.svelte';
	import { Menubar } from 'bits-ui';
	import { IconHeadphones, IconRefresh, IconX } from '@tabler/icons-svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { fade, fly } from 'svelte/transition';

	const {
		elements: {
			portalled: portalledServerSelector,
			overlay: overlayServerSelector,
			trigger: triggerServerSelector,
			content: contentServerSelector,
			close: closeServerSelector,
			title: titleServerSelector
		},
		states: { open: openServerSelector }
	} = createDialog({
		forceVisible: true,
		role: 'dialog',
		preventScroll: true
	});

	const menuFly = (element: Element) => fly(element, { duration: 150, y: -10 });
</script>

<div class="flex h-screen w-screen flex-col">
	<!-- Top Navbar -->
	<div class="flex h-8 justify-between bg-navbar/80 px-3">
		<!-- Content for top navbar -->
		<div class="flex flex-row items-center justify-center">
			<Menubar.Root class="inline-flex">
				<div class="inline-flex items-center px-2.5">
					<IconHeadphones class="text-default" />
				</div>
				<Menubar.Menu>
					<Menubar.Trigger>Connection</Menubar.Trigger>
					<Menubar.Content transition={menuFly} align="start" sideOffset={3}>
						<div use:melt={$triggerServerSelector}>
							<Menubar.Item>Select Server</Menubar.Item>
						</div>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</div>
		<div class="flex items-center justify-center">
			<DarkModeSwitcher class="bg-transparent" />
		</div>
	</div>

	<!-- Content Area with Sidebar -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<div class="h-full w-1/6 bg-navbar/80 p-4">
			<!-- Content for sidebar -->
		</div>

		<!-- Main Content -->
		<div class="flex-1 overflow-auto p-4">
			<!-- Content for main area -->
			<slot />
		</div>
	</div>
</div>

<!-- Server Selector -->
{#if $openServerSelector}
	<div use:melt={$portalledServerSelector}>
		<div
			use:melt={$overlayServerSelector}
			class="fixed inset-0 z-50 bg-gray-400/50 bg-gradient-to-l text-default"
			transition:fade={{ duration: 150 }}
		/>
		<div
			use:melt={$contentServerSelector}
			class="fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-background p-6 shadow-lg focus:outline-none"
			transition:fly={{
				x: -350,
				duration: 300,
				opacity: 1
			}}
		>
			<button
				use:melt={$closeServerSelector}
				aria-label="Close"
				class="hover:bg-default/80 focus:bg-default/80 focus:bg-default/80 absolute right-[10px] top-[10px]
					inline-flex h-6 w-6 appearance-none items-center
					justify-center rounded-full text-default focus:outline-none
					focus:ring-2"
			>
				<IconX class="size-4 text-default"></IconX>
			</button>
			<button
				aria-label="Refresh"
				class="hover:bg-default/80 focus:bg-default/80 focus:bg-default/80 absolute right-10 top-[10px]
					inline-flex h-6 w-6 appearance-none items-center
					justify-center rounded-full text-default focus:outline-none
					focus:ring-2"
			>
				<IconRefresh class="size-4 text-default"></IconRefresh>
			</button>
			<h2
				use:melt={$titleServerSelector}
				class="mb-0 select-none text-lg font-medium text-default"
			>
				Server List
			</h2>
		</div>
	</div>
{/if}
