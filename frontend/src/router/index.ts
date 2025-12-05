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

router.beforeEach((to, _from, next) => {
	if (!routes.some((route) => route.path === to.path)) {
		const matchedRoute = routes.find(
			(route) => route.path.split('/')[2] === to.path.split('/')[2]
		)

		if (matchedRoute) {
			return next({ path: matchedRoute.path })
		}

		return next({ path: '/404' })
	}

	const defaultDescription = "Toomas633's projects homepage"
	const canonicalUrl = `https://toomas633.com${to.path}`
	const pageTitle = to.meta.title?.toString() ?? defaultTitle
	const pageDescription = to.meta.description?.toString() ?? defaultDescription
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
			// Standard meta tags
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
			// Open Graph / Facebook
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
			// Twitter Card
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
