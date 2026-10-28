import { RouteRecord } from '@/types/route'

const FileOrganizerView = () => import('@/views/archive/FileOrganizerView.vue')

export const archiveRoutes: Array<RouteRecord> = [
	{
		path: '/archive/file-organizer',
		component: FileOrganizerView,
		meta: {
			title: 'File Organizer',
			canonical: '/archive/file-organizer',
			description:
				'Manage your files effortlessly with this versatile organizer script. Remove unwanted files, move specific files from subfolders, and delete empty folders. Ideal for Plex and torrent downloads, with customizable extensions. Find the code and setup instructions on GitHub.',
			icon: 'mdi-file-document-arrow-right',
			keywords:
				'file organizer, Python script, file management, Plex organizer, torrent organizer, automation, GitHub, archived project',
		},
	},
]
