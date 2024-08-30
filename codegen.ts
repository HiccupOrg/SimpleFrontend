import type { CodegenConfig } from '@graphql-codegen/cli';
import process from 'node:process';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

dotenv.config({
	encoding: 'utf-8',
	override: true,
	debug: process.env.DEBUG?.toLowerCase() == 'true'
});

const config: CodegenConfig = {
	schema: process.env.HF_BUSINESS_ENDPOINT!,
	documents: ['src/**/*.{ts,tsx}'],
	generates: {
		'./src/lib/business.generated.ts': {
			plugins: ['typescript', 'typescript-operations'],
			presetConfig: {
				gqlTagName: 'gql'
			}
		}
	},
	ignoreNoDocuments: true,
	hooks: {
		afterOneFileWrite: (filepath) => {
			const data = fs.readFileSync(filepath, 'utf-8');
			const updatedData = data.replaceAll(': any', ': unknown');
			fs.writeFileSync(filepath, updatedData, 'utf-8');
			return filepath;
		}
	}
};

export default config;
