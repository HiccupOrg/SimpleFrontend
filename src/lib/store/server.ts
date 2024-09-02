import createLazyStore from '$lib/store/lazy';
import { GET_SERVER_INFO_DETAILED, GET_USER_SERVER_LIST, GraphQLClient } from '$lib/business';
import type {
	GetServerInfoDetailedQuery,
	GetServerInfoDetailedQueryVariables,
	GetUserServerListQuery,
	GetUserServerListQueryVariables
} from '$lib/business.generated';
import { getAuthHeader } from '$lib/store/user';
import { get, writable } from 'svelte/store';
import type { ChannelItem } from '$lib/components/channel/ChannelTree.svelte';

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

export const currentServerId = writable<string | null>(null);

async function fetchServerInfo() {
	if (currentServerId) {
		const result = await GraphQLClient.query<
			GetServerInfoDetailedQuery,
			GetServerInfoDetailedQueryVariables
		>({
			query: GET_SERVER_INFO_DETAILED,
			context: {
				headers: getAuthHeader()
			},
			fetchPolicy: 'network-only',
			variables: {
				serverId: get(currentServerId)
			}
		});
		return result.data;
	}
	return null;
}

export const serverChannelsStore = createLazyStore(fetchServerInfo);

export const resetCurrentServer = () => {
	currentServerId.set(null);
	serverChannelsStore.refresh().then(null);
};

export const uiChannelItems = writable<ChannelItem[]>([
	{
		id: '<default>',
		name: 'Select a server to show channels',
		type: 'unjoinable'
	}
]);

serverChannelsStore.subscribe(({ data, loading }) => {
	if (data != null && !loading) {
		uiChannelItems.set(
			data.serverInfo.channels.map(({ id, name }) => {
				return {
					id: id as string,
					name,
					type: 'voice'
				};
			})
		);
	}
});
