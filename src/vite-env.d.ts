/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BUSINESS_ENDPOINT: string;
	readonly VITE_TURNSTILE_SITE_KEY: string;
	readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
