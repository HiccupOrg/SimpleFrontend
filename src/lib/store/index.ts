import storage from '$lib/store/storage';

interface Auth {
	token?: string;
}

export const auth = storage<Auth>('auth', {
	token: undefined
});
