import { RouteRecord } from '@/types/route'

// Lazy load server views for better performance
const MinecraftView = () => import('@/views/servers/MinecraftView.vue')

export const serversRoutes: Array<RouteRecord> = [
	{
		path: '/servers/minecraft',
		component: MinecraftView,
		meta: {
			title: 'Minecraft server',
			description:
				'Explore the detailed status and statistics of your Minecraft server with our interactive dashboard. View server status, player information, and server statistics, and check out real-time server maps and plugin lists. Stay updated with live data and intuitive UI features.',
			icon: 'mdi-minecraft',
			keywords:
				'Minecraft server, server status, player statistics, server dashboard, real-time monitoring, Minecraft plugins, game server',
			image: 'https://toomas633.com/assets/images/minecraft/background.webp',
		},
	},
]
