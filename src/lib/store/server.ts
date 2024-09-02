import createLazyStore from '$lib/store/lazy';
import { GET_USER_SERVER_LIST, GraphQLClient } from '$lib/business';
import type {
	GetUserServerListQuery,
	GetUserServerListQueryVariables
} from '$lib/business.generated';
import { getAuthHeader } from '$lib/store/user';

async function fetchJoinedServer() {
	const result = await GraphQLClient.query<
		GetUserServerListQuery,
		GetUserServerListQueryVariables
	>({
		query: GET_USER_SERVER_LIST,
		context: {
			headers: getAuthHeader()
		},
		fetchPolicy: 'network-only'
	});
	return result.data.userServerList;
}

export const serverListStore = createLazyStore(fetchJoinedServer, []);
