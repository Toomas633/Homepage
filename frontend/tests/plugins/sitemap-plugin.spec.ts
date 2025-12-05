import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { createSitemapPlugin } from '../../plugins/sitemap-plugin'

type MockFn = ReturnType<typeof vi.fn>

vi.mock('glob', () => ({
	glob: {
		sync: vi.fn(),
	},
}))

vi.mock('sitemap', () => {
	class MockSitemapStream {
		write() {
			// Mock implementation
		}
		end() {
			// Mock implementation
		}
	}

	const streamToPromise = vi.fn(async () =>
		Buffer.from(
			'<?xml version="1.0" encoding="UTF-8"?>' +
				'<urlset>' +
				'<url><loc>https://example.com/</loc><lastmod>2024-01-01</lastmod><priority>1.0</priority></url>' +
				'<url><loc>https://example.com/projects/test</loc><lastmod>2024-01-01</lastmod><priority>0.8</priority></url>' +
				'</urlset>'
		)
	)

	return {
		SitemapStream: MockSitemapStream,
		streamToPromise,
	}
})

describe('createSitemapPlugin', () => {
	const hostname = 'https://example.com'
	let tempDir: string
	let originalCwd: string

	beforeEach(() => {
		vi.clearAllMocks()
		originalCwd = process.cwd()
		tempDir = mkdtempSync(join(tmpdir(), 'sitemap-test-'))
		process.chdir(tempDir)
	})

	afterEach(() => {
		process.chdir(originalCwd)
		rmSync(tempDir, { recursive: true, force: true })
	})

	it('calls glob and sitemap stream for found routes', async () => {
		const { glob } = await import('glob')
		const { streamToPromise } = await import('sitemap')

		const routerFile = resolve('./src/router/index.ts')
		mkdirSync(dirname(routerFile), { recursive: true })

		writeFileSync(
			routerFile,
			[
				'export const routes = [',
				"  { path: '/', component: Home },",
				"  { path: '/projects/test', component: Project },",
				']',
				'',
			].join('\n'),
			'utf-8'
		)
		;(glob.sync as unknown as MockFn).mockReturnValue([routerFile])

		const plugin = createSitemapPlugin(hostname)

		mkdirSync(resolve('./dist'), { recursive: true })
		;(plugin.generateBundle as () => void)()

		await vi.waitFor(() => {
			expect(streamToPromise).toHaveBeenCalled()
		})

		expect(glob.sync).toHaveBeenCalledWith('./src/router/*.ts')
	})
})
