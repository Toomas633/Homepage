import { build } from 'esbuild'

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
