export * as types from './business.generated';
import { gql } from '@apollo/client';

export const REGISTER_ANONYMOUS_IDENTIFY = gql`
	mutation RegisterAnonymous($publicKey: String!) {
		registerAnonymous(publicKey: $publicKey) {
			id
		}
	}
`;
