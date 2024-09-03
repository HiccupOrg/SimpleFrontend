import { get, writable } from 'svelte/store';

interface LazyInternalData<T> {
	data: T | null;
	loading: boolean;
	error: unknown | null;
}

const createLazyStore = <T>(
	resolver: () => Promise<T> | T,
	defaultValue: T | null = null,
	dispose?: (value: T) => Promise<void> | void
) => {
	const storeValue = writable<LazyInternalData<T>>({
		data: defaultValue,
		loading: false,
		error: null
	});
	const { subscribe, set, update } = storeValue;

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
		if (dispose) {
			const ref = get(storeValue);
			if (ref.data !== null) {
				await dispose(ref.data);
			}
		}
		await load();
	}

	return {
		subscribe,
		load,
		refresh
	};
};

export default createLazyStore;
