import type { PageLoad } from './$types';
import { currentServerId, resetCurrentServer, serverChannelsStore } from '$lib/store/server';

export const load: PageLoad = async ({ params }) => {
	resetCurrentServer();

	const serverId = params.sid;
	currentServerId.set(serverId);

	await serverChannelsStore.load();

	return {
		title: 'Hiccup'
	};
};
