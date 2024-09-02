export * as types from './business.generated';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core';

export const REGISTER_ANONYMOUS_IDENTIFY = gql`
	mutation RegisterAnonymous($publicKey: String!) {
		registerAnonymous(publicKey: $publicKey) {
			id
		}
	}
`;

export const REGISTER_CLASSIC_IDENTIFY = gql`
	mutation RegisterClassic($username: String!, $password: String!) {
		registerClassic(username: $username, password: $password) {
			id
		}
	}
`;

export const LOGIN_CLASSIC = gql`
	mutation LoginClassic($username: String!, $password: String!) {
		loginClassic(username: $username, password: $password) {
			token
		}
	}
`;

export const GET_USER_SERVER_LIST = gql`
	query GetUserServerList {
		userServerList {
			id
			name
			configuration
		}
	}
`;

export const GET_CURRENT_USER_INFO_SIMPLE = gql`
	query GetCurrentUserInfoSimple {
		selfInfo {
			... on UserBase {
				type
			}
		}
	}
`;

export const GET_SERVER_INFO_DETAILED = gql`
	query GetServerInfoDetailed($serverId: obfuscatedId!) {
		serverInfo(serverId: $serverId) {
			id
			name
			configuration
			channels {
				id
				name
				joinable
				configuration
			}
		}
	}
`;

export const GraphQLEndpoint = import.meta.env.VITE_BUSINESS_ENDPOINT;

export const GraphQLClient = new ApolloClient({
	uri: GraphQLEndpoint,
	cache: new InMemoryCache({
		resultCaching: false
	})
});
