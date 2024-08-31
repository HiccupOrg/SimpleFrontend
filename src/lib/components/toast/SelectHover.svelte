<script lang="ts">
	import { Check, ChevronDown } from '$icons/index.js';
	import { createSelect, melt, type CreateToasterProps } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	const options: { value: CreateToasterProps['hover']; label: string }[] = [
		{ value: 'pause', label: 'pause' },
		{ value: 'pause-all', label: 'pause-all' },
		{ value: null, label: 'null' }
	];

	const {
		elements: { trigger, menu, option, label },
		states: { selected, selectedLabel, open },
		helpers: { isSelected }
	} = createSelect<CreateToasterProps['hover']>({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		},
		defaultSelected: { value: 'pause', label: 'pause' }
	});

	export let value: CreateToasterProps['hover'];

	$: value = $selected?.value;
</script>

<div class="absolute left-4 top-4">
	<div class="flex flex-col gap-1">
		<label class="block text-white" use:melt={$label}> Hover behavior : </label>
		<button
			class="text-magnum-700 flex h-10 min-w-[220px] items-center justify-between rounded-lg bg-white px-3
  py-2 shadow transition-opacity hover:opacity-90"
			use:melt={$trigger}
			aria-label="Hover behavior"
		>
			{$selectedLabel || 'Select hover behavior'}
			<ChevronDown class="size-5" />
		</button>
		{#if $open}
			<div
				class=" z-10 flex max-h-[300px] flex-col
    overflow-y-auto rounded-lg bg-white p-1
    shadow focus:!ring-0"
				use:melt={$menu}
				transition:fade={{ duration: 150 }}
			>
				{#each options as { value, label }}
					<div
						class="hover:bg-magnum-100 focus:text-magnum-700 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 relative cursor-pointer rounded-lg
              py-1 pl-8
              pr-4
              text-neutral-800 focus:z-10
              data-[disabled]:opacity-50"
						use:melt={$option({ value, label })}
					>
						<div class="check {$isSelected(value) ? 'block' : 'hidden'}">
							<Check class="size-4" />
						</div>

						{label}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.check {
		position: absolute;
		left: theme(spacing.2);
		top: 50%;
		z-index: theme(zIndex.20);
		translate: 0 calc(-50% + 1px);
		color: theme(colors.primary.500);
	}
</style>
