function readEnv(key: string): string | undefined {
	const env = import.meta.env
	const direct = env[key as keyof ImportMetaEnv]
	const fromProcess =
		typeof process === 'undefined' ? undefined : process.env?.[key]
	return direct || fromProcess || undefined
}

export const GITHUB_TOKEN = readEnv('VITE_GITHUB_TOKEN') || ''
export const API_URL = readEnv('VITE_API_URL') || '/api'
export const APP_ENV = readEnv('VITE_APP_ENV') || 'production'

export const APP_VERSION =
	typeof __APP_VERSION__ === 'undefined' ? '' : __APP_VERSION__

export const VUE_VERSION =
	typeof __VUE_VERSION__ === 'undefined' ? '' : __VUE_VERSION__

export const VUETIFY_VERSION =
	typeof __VUETIFY_VERSION__ === 'undefined' ? '' : __VUETIFY_VERSION__

export { readEnv }
