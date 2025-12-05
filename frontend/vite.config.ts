import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import compression from 'vite-plugin-compression'
import { constants } from 'node:zlib'
import imagemin from 'unplugin-imagemin/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { createSitemapPlugin } from './plugins/sitemap-plugin'
import pkg from './package.json'

export default defineConfig(({ command, mode }): UserConfig => {
	const version = pkg.version || '0.0.0'
	const vueVersion = (pkg.dependencies?.vue ?? '').replace('^', '')
	const vuetifyVersion = (pkg.dependencies?.vuetify ?? '').replace('^', '')
	return {
		define: {
			__VUE_VERSION__: JSON.stringify(vueVersion),
			__VUETIFY_VERSION__: JSON.stringify(vuetifyVersion),
			__APP_VERSION__: JSON.stringify(version),
		},
		plugins: [
			vue({ template: { transformAssetUrls } }),
			vuetify(),
			vueDevTools(),
			Components(),
			compression({
				algorithm: 'brotliCompress',
				ext: '.br',
				threshold: 10240,
				compressionOptions: {
					params: {
						[constants.BROTLI_PARAM_QUALITY]: 11,
					},
				},
			}),
			imagemin({
				compress: {
					mozjpeg: { quality: 90, progressive: true },
					webp: { quality: 100, lossless: 1 },
					png: { quality: 95, lossless: 1 },
					avif: { cqLevel: 12, speed: 6 },
				},
				conversion: [
				 	{ from: 'png', to: 'webp' },
				 	{ from: 'jpg', to: 'webp' },
					{ from: 'jpeg', to: 'webp' }
				 ],
			}),
			createSitemapPlugin('https://toomas633.com'),
		],
		optimizeDeps: {
			exclude: [
				'vuetify',
				'vue-router',
			],
		},
		server: {
			host: true,
			port: 5173,
			strictPort: true,
			open: false
		},
		preview: {
			port: 4173,
			host: true
		},
		build: {
			sourcemap: mode === 'development',
			chunkSizeWarningLimit: 1500,
			minify: command === 'build' ? 'terser' : false,
			target: 'esnext',
			terserOptions: {
				compress: {
					drop_console: command === 'build',
					drop_debugger: true,
					passes: 2
				},
				format: { 
					comments: false 
				},
			},
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: {
						vue: ['vue', 'vue-router'],
						vuetify: ['vuetify'],
						vendor: ['@vueuse/head', 'vue-cookies']
					}
				}
			},
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@public': fileURLToPath(new URL('./public', import.meta.url)),
			},
		},
	}
})
