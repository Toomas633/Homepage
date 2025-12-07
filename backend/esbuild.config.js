import { build } from 'esbuild'
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

await build({
	entryPoints: ['src/app.ts'],
	bundle: true,
	platform: 'node',
	target: 'es2022',
	format: 'esm',
	outfile: 'dist/app.js',
	external: ['node:*'],
	banner: {
		js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
	},
	sourcemap: true,
	minify: true,
	logLevel: 'info',
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

console.log('✓ Copied YAML configuration files to dist/config/')
