import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import compression from 'vite-plugin-compression'
import { constants } from 'node:zlib'
import viteImagemin from 'vite-plugin-imagemin'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
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
			ViteImageOptimizer({
				png: { quality: 95 },
				jpg: { quality: 90, progressive: true },
				jpeg: { quality: 90, progressive: true },
				webp: { lossless: true, quality: 100 },
				avif: { lossless: false, quality: 12, speed: 6 },
				cache: true,
				cacheLocation: '.cache/image-optimizer',
			}),
			viteImagemin({
				webp: { quality: 100, method: 6 },
				mozjpeg: { quality: 90, progressive: true },
				pngquant: { quality: [0.9, 0.95] },
				optipng: { optimizationLevel: 5 },
				svgo: { plugins: [{ name: 'preset-default' }] },
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
			cssCodeSplit: true,
			terserOptions: {
				compress: {
					drop_console: command === 'build',
					drop_debugger: true,
					passes: 2,
					pure_funcs: ['console.log', 'console.info', 'console.debug']
				},
				format: { 
					comments: false 
				},
			},
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: (id) => {
						const getNodeModuleChunk = (id: string): string | undefined => {
							const moduleChecks = [
								{ includes: 'vue-router', chunk: 'vue-router' },
								{ includes: 'vue', chunk: 'vue', exclude: 'vue-router' },
								{ includes: 'vuetify', chunk: 'vuetify' },
								{ includes: '@vueuse', chunk: 'vueuse' },
								{ includes: 'leaflet', chunk: 'leaflet' },
								{ includes: 'axios', chunk: 'axios' },
							]
							
							for (const check of moduleChecks) {
								if (id.includes(check.includes)) {
									if (!check.exclude || !id.includes(check.exclude)) {
										return check.chunk
									}
								}
							}
							return 'vendor'
						}
						
						const getViewChunk = (id: string): string | undefined => {
							const viewPath = id.split('/views/')[1]
							const viewTypes = [
								{ includes: 'projects/', chunk: 'views-projects' },
								{ includes: 'demos/', chunk: 'views-demos' },
								{ includes: 'servers/', chunk: 'views-servers' },
							]
							
							for (const type of viewTypes) {
								if (viewPath.includes(type.includes)) {
									return type.chunk
								}
							}
							return 'views-main'
						}
						
						if (id.includes('node_modules')) {
							return getNodeModuleChunk(id)
						}
						if (id.includes('/views/')) {
							return getViewChunk(id)
						}
					},
					chunkFileNames: 'assets/[name]-[hash].js',
					entryFileNames: 'assets/[name]-[hash].js',
					assetFileNames: 'assets/[name]-[hash].[ext]'
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
