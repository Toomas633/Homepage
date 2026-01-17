import { build } from 'esbuild'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

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
