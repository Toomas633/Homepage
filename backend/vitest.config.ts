import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as {
	version: string
}

export default defineConfig({
	define: {
		'globalThis.__APP_VERSION__': JSON.stringify(version),
	},
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./tests/setup.ts'],
		include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
		env: {
			NODE_ENV: 'test',
			EMAIL_HOST: 'smtp.test.com',
			EMAIL_USER: 'test@example.com',
			EMAIL_PASS: 'test-password',
			EMAIL_TO: 'recipient@example.com',
			EMAIL_PORT: '587',
			EMAIL_TLS: 'true',
			ALLOWED_ORIGINS: 'http://localhost:5173,http://localhost:3000',
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
				'src/types/',
			],
		},
	},
})
