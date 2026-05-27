import { build } from 'esbuild'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const { version } = JSON.parse(readFileSync('package.json', 'utf8'))

await build({
	entryPoints: ['src/app.ts'],
	bundle: true,
	platform: 'node',
	target: 'es2022',
	external: ['node:*', 'swagger-ui-dist/absolute-path'],
	sourcemap: true,
	minify: true,
	logLevel: 'info',
	format: 'cjs',
	outfile: 'dist/app.cjs',
	define: {
		'globalThis.__APP_VERSION__': JSON.stringify(version),
	},
})

const configDir = join('dist', 'config')
mkdirSync(configDir, { recursive: true })
copyFileSync(
	join('src', 'config', 'swagger.yaml'),
	join(configDir, 'swagger.yaml')
)
copyFileSync(
	join('src', 'config', 'swagger-paths.yaml'),
	join(configDir, 'swagger-paths.yaml')
)
