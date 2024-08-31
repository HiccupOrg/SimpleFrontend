<script lang="ts" context="module">
	export type ToastData = {
		title: string;
		description?: string;
		color?: string;
	};

	const {
		elements,
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const addToast = helpers.addToast;
</script>

<script lang="ts">
	import { createToaster } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import Toast from '$lib/components/toast/Toast.svelte';
</script>

<div
	use:portal
	class="fixed bottom-0 right-0 z-50 m-5 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
>
	{#each $toasts as toast (toast.id)}
		<div animate:flip={{ duration: 500 }}>
			<Toast {elements} {toast} />
		</div>
	{/each}
</div>
