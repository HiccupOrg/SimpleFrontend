export * as types from './business.generated';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core';

export const REGISTER_ANONYMOUS_IDENTIFY = gql`
	mutation RegisterAnonymous($publicKey: String!) {
		registerAnonymous(publicKey: $publicKey) {
			id
		}
	}
`;

export const GraphQLEndpoint = import.meta.env.HF_BUSINESS_ENDPOINT;

export const GraphQLClient = new ApolloClient({
	uri: GraphQLEndpoint,
	cache: new InMemoryCache({
		resultCaching: false
	})
});
