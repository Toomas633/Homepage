import { RouteRecord } from '@/types/route'

const HomeView = () => import('@/views/HomeView.vue')
const ContactView = () => import('@/views/ContactView.vue')
const DonateView = () => import('@/views/DonateView.vue')
const ToS = () => import('@/views/ToS.vue')
const PrivacyPolicy = () => import('@/views/PrivacyPolicy.vue')
const NotFound = () => import('@/views/NotFound.vue')

export const mainRoutes: Array<RouteRecord> = [
	{
		path: '/',
		component: HomeView,
		meta: {
			title: "Toomas633's Dungeon",
			canonical: '/',
			description:
				'Explore the projects and interests of a tech enthusiast and full-time developer. From robotics to 3D printing and find open-source work on GitHub and Thingiverse.',
			keywords:
				'Toomas633, portfolio, web development, robotics, 3D printing, programming, projects, GitHub, full-stack developer, software engineer',
		},
	},
	{
		path: '/contact',
		component: ContactView,
		meta: {
			title: 'Contact',
			canonical: '/contact',
			description:
				'Get in touch through our contact page! Report issues, ask questions, or provide feedback via our contact form or directly by email. Choose from various project topics and send your message quickly and securely. Spam will be reported and banned.',
			keywords:
				'contact, contact form, get in touch, email, feedback, support, questions',
		},
	},
	{
		path: '/donate',
		component: DonateView,
		meta: {
			title: 'Donate',
			canonical: '/donate',
			description:
				'Support my student projects with any amount you choose. Explore ways to contribute through Amazon, PayPal, or Bitcoin. Every donation helps fund my ongoing projects and future endeavors.',
			keywords:
				'donate, support, PayPal, Bitcoin, cryptocurrency, funding, contributions, student projects',
		},
	},
	{
		path: '/tos',
		component: ToS,
		meta: {
			title: 'ToS',
			canonical: '/tos',
			description:
				"Review the Terms of Service for Toomas633's Dungeon, effective from July 12, 2024. This page outlines your rights and responsibilities while using our website, including usage guidelines, intellectual property rights, and limitations of liability. For any questions, contact us directly via email.",
			keywords:
				'terms of service, ToS, legal, user agreement, terms and conditions, website policy',
		},
	},
	{
		path: '/privacy',
		component: PrivacyPolicy,
		meta: {
			title: 'Privacy Policy',
			canonical: '/privacy',
			description:
				"Review Toomas633's Dungeon Privacy Policy, effective July 12, 2024. Learn how we collect, use, and protect your information when using our website and services. Understand our practices regarding cookies, data security, and your rights to manage your personal data. For any questions, contact us directly.",
			keywords:
				'privacy policy, data protection, cookies, GDPR, privacy, personal data, security',
		},
	},
	{
		path: '/404',
		component: NotFound,
		meta: {
			title: '404 Not Found',
			description: 'The page you are looking for does not exist.',
			canonical: '/404',
			robots: 'noindex,follow',
			keywords: '404, not found, error page',
		},
	},
]
