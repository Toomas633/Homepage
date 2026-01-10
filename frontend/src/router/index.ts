import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'
import { projectRoutes } from './projects'
import { mainRoutes } from './main'
import { demoRoutes } from './demos'
import { archiveRoutes } from './archive'
import { RouteRecord } from '@/types/route'
import { serversRoutes } from './servers'

const routes: Array<RouteRecord> = [
	...mainRoutes,
	...projectRoutes,
	...demoRoutes,
	...archiveRoutes,
	...serversRoutes,
]

const router = createRouter({
	history: createWebHistory(),
	routes: routes as unknown as Array<RouteRecordRaw>,
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) return savedPosition
		return false
	},
})

const defaultTitle = "Toomas633's Dungeon"

const siteOrigin = 'https://toomas633.com'

const normalizePath = (rawPath: string): string => {
	if (!rawPath) return '/'
	let path = rawPath
	while (path.length > 1 && path.endsWith('/')) {
		path = path.slice(0, -1)
	}
	return path
}

const routePathSet = new Set(routes.map((route) => normalizePath(route.path)))

const buildCanonicalUrl = (normalizedPath: string, rawCanonical?: string) => {
	if (!rawCanonical) return `${siteOrigin}${normalizedPath}`

	const canonical = rawCanonical.trim()
	if (!canonical) return `${siteOrigin}${normalizedPath}`
	if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
		return canonical
	}

	const canonicalPath = canonical.startsWith('/') ? canonical : `/${canonical}`
	return `${siteOrigin}${canonicalPath}`
}

const getSlug = (path: string): string | undefined => {
	const segments = normalizePath(path).split('/').filter(Boolean)
	const last = segments.at(-1)
	return last ? last.toLowerCase() : undefined
}

const slugToPaths = routes.reduce<Map<string, string[]>>((acc, route) => {
	const normalized = normalizePath(route.path)
	if (normalized === '/' || normalized === '/404') return acc

	const slug = getSlug(normalized)
	if (!slug) return acc

	const list = acc.get(slug)
	if (list) {
		list.push(normalized)
	} else {
		acc.set(slug, [normalized])
	}

	return acc
}, new Map())

const findMovedPagePath = (rawPath: string): string | undefined => {
	const path = normalizePath(rawPath)
	const segments = path.split('/').filter(Boolean)
	const last = segments.at(-1)?.toLowerCase()
	if (!last || last === '404') return undefined

	const candidates = slugToPaths.get(last)
	if (!candidates || candidates.length === 0) return undefined
	if (candidates.length === 1) return candidates[0]

	const section = segments[0]?.toLowerCase()
	if (section) {
		const sameSection = candidates.filter(
			(candidate) => candidate.split('/')[1]?.toLowerCase() === section
		)
		if (sameSection.length === 1) return sameSection[0]
	}

	return undefined
}

const findClosestMatchingPath = (rawPath: string): string | undefined => {
	const path = normalizePath(rawPath)
	const segments = path.split('/').filter(Boolean)

	while (segments.length > 0) {
		const candidatePath = `/${segments.join('/')}`
		if (candidatePath !== '/' && routePathSet.has(candidatePath)) {
			return candidatePath
		}
		segments.pop()
	}

	return undefined
}

router.beforeEach((to, _from, next) => {
	const normalizedToPath = normalizePath(to.path)

	if (!routePathSet.has(normalizedToPath)) {
		const moved = findMovedPagePath(normalizedToPath)
		if (moved) {
			return next({ path: moved, replace: true })
		}

		const closest = findClosestMatchingPath(normalizedToPath)
		if (closest) {
			return next({ path: closest, replace: true })
		}

		return next({ path: '/404', replace: true })
	}

	const defaultDescription = "Toomas633's projects homepage"
	const rawCanonical = to.meta.canonical?.toString()
	const canonicalUrl = buildCanonicalUrl(normalizedToPath, rawCanonical)
	const pageTitle = to.meta.title?.toString() ?? defaultTitle
	const pageDescription = to.meta.description?.toString() ?? defaultDescription
	const pageRobots = to.meta.robots?.toString() ?? 'index,follow'
	const pageImage =
		to.meta.image?.toString() ?? 'https://toomas633.com/logo.svg'
	const pageKeywords =
		to.meta.keywords?.toString() ??
		'Toomas633, portfolio, web development, robotics, 3D printing, programming, projects'

	document.title = pageTitle

	useHead({
		link: [
			{
				rel: 'canonical',
				href: canonicalUrl,
			},
		],
		meta: [
			{
				name: 'robots',
				content: pageRobots,
			},
			{
				name: 'description',
				content: pageDescription,
			},
			{
				name: 'keywords',
				content: pageKeywords,
			},
			{
				name: 'author',
				content: 'Toomas633',
			},
			{
				property: 'og:type',
				content: 'website',
			},
			{
				property: 'og:url',
				content: canonicalUrl,
			},
			{
				property: 'og:title',
				content: pageTitle,
			},
			{
				property: 'og:description',
				content: pageDescription,
			},
			{
				property: 'og:image',
				content: pageImage,
			},
			{
				property: 'og:site_name',
				content: "Toomas633's Dungeon",
			},
			{
				property: 'og:locale',
				content: 'en_US',
			},
			{
				name: 'twitter:card',
				content: 'summary_large_image',
			},
			{
				name: 'twitter:url',
				content: canonicalUrl,
			},
			{
				name: 'twitter:title',
				content: pageTitle,
			},
			{
				name: 'twitter:description',
				content: pageDescription,
			},
			{
				name: 'twitter:image',
				content: pageImage,
			},
		],
	})

	next()
})

router.afterEach((to) => {
	document.title = to.meta.title?.toString() ?? defaultTitle

	requestAnimationFrame(() => {
		const scroller = document.querySelector('.v-main')

		if (to.hash) {
			const raw = to.hash.replace(/^#/, '')
			const needle = decodeURIComponent(raw).trim().toLowerCase()
			const target = document.getElementById(needle)
			if (target) {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' })
				return
			}
		}

		if (scroller && typeof scroller.scrollTo === 'function') {
			scroller.scrollTo({ top: 0, left: 0 })
		} else {
			window.scrollTo({ top: 0, left: 0 })
		}
	})
})

export default router
