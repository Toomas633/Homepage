import { writeFileSync, readFileSync } from 'node:fs'
import { SitemapStream, streamToPromise } from 'sitemap'
import { glob } from 'glob'
import type { Plugin } from 'vite'

interface SitemapRoute {
	path: string
	priority: number
	lastmod: Date
}

function prettifyXml(xmlString: string): string {
	const PADDING = '  '

	const urlRegex = /<url>.*?<\/url>/g
	const urlMatches: string[] = []
	let urlExec: RegExpExecArray | null
	while ((urlExec = urlRegex.exec(xmlString)) !== null) {
		urlMatches.push(urlExec[0])
	}

	const sortedUrls = urlMatches.toSorted((a, b) => {
		const locA = /<loc>(.*?)<\/loc>/.exec(a)?.[1] || ''
		const locB = /<loc>(.*?)<\/loc>/.exec(b)?.[1] || ''
		return locA.localeCompare(locB)
	})

	const formattedUrls = sortedUrls
		.map((url) => {
			const loc = /<loc>(.*?)<\/loc>/.exec(url)?.[1] || ''
			const lastmod = /<lastmod>(.*?)<\/lastmod>/.exec(url)?.[1] || ''
			const priority = /<priority>(.*?)<\/priority>/.exec(url)?.[1] || ''

			return `${PADDING}<url>
${PADDING}${PADDING}<loc>${loc}</loc>
${PADDING}${PADDING}<lastmod>${lastmod}</lastmod>
${PADDING}${PADDING}<priority>${priority}</priority>
${PADDING}</url>`
		})
		.join('\n')

	const xmlDeclaration = /<\?xml.*?\?>/.exec(xmlString)?.[0] || ''
	const urlsetStart = /<urlset[^>]*>/.exec(xmlString)?.[0] || ''
	const urlsetEnd = '</urlset>'

	return `${xmlDeclaration}
${urlsetStart}
${formattedUrls}
${urlsetEnd}`
}

export function createSitemapPlugin(hostname: string): Plugin {
	return {
		name: 'sitemap-generator',
		generateBundle() {
			const extractRoutesFromFile = (
				filePath: string
			): Array<{ path: string; priority: number }> => {
				try {
					const content = readFileSync(filePath, 'utf-8')
					const routes: Array<{ path: string; priority: number }> = []

					const pathRegex = /path:\s*['"`]([^'"`]+)['"`]/g
					let match: RegExpExecArray | null
					while ((match = pathRegex.exec(content)) !== null) {
						const path = match[1]

						let priority = 0.5
						if (path === '/') priority = 1
						else if (path.startsWith('/projects/')) priority = 0.8
						else if (path.startsWith('/servers/')) priority = 0.7
						else if (path.startsWith('/demos/')) priority = 0.6
						else if (path.startsWith('/contact') || path.startsWith('/donate'))
							priority = 0.6

						routes.push({ path, priority })
					}

					return routes
				} catch (error) {
					console.warn(`Failed to read router file ${filePath}:`, error)
					return []
				}
			}

			const routerFiles = glob.sync('./src/router/*.ts')
			const allRoutes: Array<SitemapRoute> = []

			for (const file of routerFiles) {
				const routes = extractRoutesFromFile(file)
				for (const route of routes) {
					allRoutes.push({
						...route,
						lastmod: new Date(),
					})
				}
			}

			const uniqueRoutes = allRoutes.filter(
				(route, index, self) =>
					index === self.findIndex((r) => r.path === route.path)
			)

			const sitemapStream = new SitemapStream({ hostname })

			for (const route of uniqueRoutes) {
				sitemapStream.write({
					url: route.path,
					priority: route.priority,
					lastmod: route.lastmod,
				})
			}

			sitemapStream.end()

			streamToPromise(sitemapStream)
				.then((data) => {
					const xmlString = data.toString()
					const prettifiedXml = prettifyXml(xmlString)
					writeFileSync('./dist/sitemap.xml', prettifiedXml)
				})
				.catch((err) => console.error('Sitemap generation failed:', err))
		},
	}
}
