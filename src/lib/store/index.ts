import storage from '$lib/store/storage';
import { get } from 'svelte/store';

interface Auth {
	token?: string;
}

export const auth = storage<Auth>('auth', {
	token: undefined
});

export function userLoggedIn(): boolean {
	return get(auth).token != undefined;
}
