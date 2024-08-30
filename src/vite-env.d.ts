/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly HF_BUSINESS_ENDPOINT: string
	readonly BASE_PATH?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}