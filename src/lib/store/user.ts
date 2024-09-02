import storage from '$lib/store/storage';
import { get } from 'svelte/store';
import { GET_CURRENT_USER_INFO_SIMPLE, GraphQLClient } from '$lib/business';
import type {
	GetCurrentUserInfoSimpleQuery,
	GetCurrentUserInfoSimpleQueryVariables
} from '$lib/business.generated';

interface Auth {
	token?: string;
}

export const auth = storage<Auth>('auth', {
	token: undefined
});

export function userLoggedIn(): boolean {
	return get(auth).token != undefined;
}

export function getAuthToken(): string | undefined {
	return get(auth).token;
}

export function getAuthHeader() {
	const token = getAuthToken();

	if (token) {
		return {
			'X-Hiccup-Token': token
		};
	}

	return undefined;
}

export async function validateAuthToken(token?: string): Promise<boolean> {
	token = token || getAuthToken();

	try {
		await GraphQLClient.query<
			GetCurrentUserInfoSimpleQuery,
			GetCurrentUserInfoSimpleQueryVariables
		>({
			query: GET_CURRENT_USER_INFO_SIMPLE,
			context: {
				headers: {
					'X-Hiccup-Token': token
				}
			}
		});
	} catch {
		return false;
	}

	return true;
}

export function resetToken() {
	auth.set({
		token: undefined
	});
}
