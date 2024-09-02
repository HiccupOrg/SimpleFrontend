import { writable } from 'svelte/store';

interface LazyInternalData<T> {
	data: T | null;
	loading: boolean;
	error: unknown | null;
}

const createLazyStore = <T>(resolver: () => Promise<T> | T, defaultValue: T | null = null) => {
	const { subscribe, set, update } = writable<LazyInternalData<T>>({
		data: defaultValue,
		loading: false,
		error: null
	});

	async function load() {
		update((state) => ({
			...state,
			loading: true,
			error: null
		}));

		try {
			const data = await resolver();
			set({
				data,
				loading: false,
				error: null
			});
		} catch (error) {
			set({
				data: null,
				loading: false,
				error
			});
		}
	}

	async function refresh() {
		await load();
	}

	return {
		subscribe,
		load,
		refresh
	};
};

export default createLazyStore;
