import { RouteRecord } from '@/types/route'

const T6DroneView = () => import('@/views/projects/T6DroneView.vue')
const RoboticArmView = () => import('@/views/projects/RoboticArmView.vue')
const FileShareView = () => import('@/views/projects/FileShareView.vue')
const PlexOrganizerView = () => import('@/views/projects/PlexOrganizerView.vue')
const XMrigProxyView = () => import('@/views/projects/XMrigProxyView.vue')

export const projectRoutes: Array<RouteRecord> = [
	{
		path: '/projects/t6-drone',
		component: T6DroneView,
		meta: {
			title: 'T6 Drone',
			canonical: '/projects/t6-drone',
			description:
				'Explore my first drone project, built on a DJI F450 frame. Access all 3D and project files on GitHub and download STL files from Thingiverse. Check out images of the build process and final product.',
			icon: 'mdi-quadcopter',
			keywords:
				'T6 drone, DJI F450, drone project, 3D printing, quadcopter, DIY drone, Arduino drone, GitHub, Thingiverse',
			image: 'https://toomas633.com/assets/images/t6-drone/complete.webp',
		},
	},
	{
		path: '/projects/robotic-arm',
		component: RoboticArmView,
		meta: {
			title: 'Robotic Arm',
			canonical: '/projects/robotic-arm',
			description:
				'Discover my first Arduino robotic arm project, controlled via joystick input. Built with metal-geared servos for stability and performance, this project can lift up to 1kg. Access the code and 3D models on GitHub and Thingiverse, and view detailed images of the setup and wiring.',
			icon: 'mdi-robot-industrial',
			keywords:
				'robotic arm, Arduino, servos, robotics project, DIY robot, joystick control, 3D printing, metal-geared servos, GitHub',
			image: 'https://toomas633.com/assets/images/robotic-arm/arm.webp',
		},
	},
	{
		path: '/projects/fileshare',
		component: FileShareView,
		meta: {
			title: 'FileShare',
			canonical: '/projects/fileshare',
			description:
				'FileShare is a user-friendly file sharing website with features like direct link generation, delete timers, and file previews. Easily upload files, set expiration times, and manage links through an intuitive admin page. Available on GitHub and Docker Hub, with detailed setup instructions for local and server environments.',
			icon: 'mdi-share-variant',
			keywords:
				'file sharing, web app, file upload, link generator, Docker, Node.js, Vue.js, file management, open source',
			image: 'https://toomas633.com/assets/images/fileshare/upload.webp',
		},
	},
	{
		path: '/projects/plex-organizer',
		component: PlexOrganizerView,
		meta: {
			title: 'Plex Organizer',
			canonical: '/projects/plex-organizer',
			description:
				'Python-based utility designed to help manage and organize media files for Plex Media Server. It automates tasks such as renaming files, deleting unwanted files, moving directories, and cleaning up empty folders.',
			icon: 'mdi-file-document-arrow-right',
			keywords:
				'Plex, media organizer, Python, automation, file management, Plex Media Server, media library, utility tool',
			image: 'https://toomas633.com/assets/images/plex-organizer/example.png',
		},
	},
	{
		path: '/projects/xmrig-proxy',
		component: XMrigProxyView,
		meta: {
			title: 'XMRig Proxy',
			canonical: '/projects/xmrig-proxy',
			description: 'XMRig Proxy with web server for statistics.',
			icon: 'mdi-currency-btc',
			keywords:
				'XMRig, cryptocurrency mining, proxy server, Monero, mining pool, web statistics, crypto',
			image: 'https://toomas633.com/assets/images/xmrig-proxy/image.png',
		},
	},
	{
		path: '/projects/adlist-parser',
		component: () => import('@/views/projects/AdlistParserView.vue'),
		meta: {
			title: 'Adlist Parser',
			canonical: '/projects/adlist-parser',
			description:
				'A high-performance Python utility that fetches and merges multiple adlists into domain-only output for DNS blockers like Pi-hole, AdGuard, and similar DNS filtering solutions.',
			icon: 'mdi-advertisements-off',
			keywords:
				'adlist parser, DNS blocker, Pi-hole, AdGuard, domain filtering, Python utility, adlist merging, high-performance',
		},
	},
]
