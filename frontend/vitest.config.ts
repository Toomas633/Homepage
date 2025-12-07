import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	plugins: [
		vue(),
		vuetify({ autoImport: true }),
	],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'dist/',
				'tests/',
				'**/*.spec.ts',
				'**/*.test.ts',
				'**/*.d.ts',
				'src/constants/',
				'vite.config.ts',
				'vitest.config.ts',
			],
		},
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	ssr: {
		noExternal: ['vuetify'],
	},
});
