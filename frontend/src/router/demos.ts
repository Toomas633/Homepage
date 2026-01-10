import { RouteRecord } from '@/types/route'

const StudentApiView = () => import('@/views/demos/StudentApiView.vue')
const ContactApiView = () => import('@/views/demos/ContactApiView.vue')
const ClickCounterView = () => import('@/views/demos/ClickCounterView.vue')
const HomepageView = () => import('@/views/demos/HomepageView.vue')

export const demoRoutes: Array<RouteRecord> = [
	{
		path: '/demos/homepage',
		component: HomepageView,
		meta: {
			title: 'Homepage',
			canonical: '/demos/homepage',
			description:
				'A modern full-stack personal projects homepage built with Vue 3, TypeScript, and Node.js.',
			icon: 'mdi-home-account',
			keywords:
				'homepage, portfolio, vue, vuetify, typescript, node, express, docker, nginx, sonarcloud, vitest',
		},
	},
	{
		path: '/demos/student-api',
		component: StudentApiView,
		meta: {
			title: 'Student API',
			canonical: '/demos/student-api',
			description:
				'This project is a simple Node.js API built with TypeScript and Express. It provides CRUD operations for managing student data.',
			icon: 'mdi-account-school',
			keywords:
				'Student API, Node.js, TypeScript, Express, REST API, CRUD operations, demo, web development',
		},
	},
	{
		path: '/demos/contact-api',
		component: ContactApiView,
		meta: {
			title: 'Contact API',
			canonical: '/demos/contact-api',
			description:
				'A minimal contact management system with a Java REST API, PostgreSQL storage, and a simple JavaScript UI for adding, viewing, and searching contacts.',
			icon: 'mdi-card-account-mail',
			keywords:
				'Contact API, Java, REST API, PostgreSQL, JavaScript, contact management, demo, database',
		},
	},
	{
		path: '/demos/click-counter',
		component: ClickCounterView,
		meta: {
			title: 'Click Counter',
			canonical: '/demos/click-counter',
			description: 'Simple demo click counter webpage',
			icon: 'mdi-cursor-pointer',
			keywords:
				'click counter, web demo, JavaScript, interactive demo, simple web app',
		},
	},
]
