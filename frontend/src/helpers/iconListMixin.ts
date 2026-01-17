import type { IconListItem } from '@/types/iconList'

export default function useIconListMixin() {
	const createPreset = (
		preset: Omit<IconListItem, 'text'> & { title?: string }
	) => {
		return (input: Omit<IconListItem, 'icon'>): IconListItem => ({
			...preset,
			...input,
			color: input.color ?? preset.color,
		})
	}

	const iconListPresets = {
		typeScript: createPreset({
			icon: 'mdi-language-typescript',
			title: 'TypeScript',
			color: '#3178c6',
		}),
		testing: createPreset({
			icon: 'mdi-test-tube',
			title: 'Testing',
			color: '#6e9f18',
		}),
		docker: createPreset({
			icon: 'mdi-docker',
			title: 'Docker',
			color: '#2496ed',
		}),
		express: createPreset({
			icon: 'mdi-rocket-launch',
			title: 'Express',
			color: '#ff9800',
		}),
		codeQuality: createPreset({
			icon: 'mdi-check-decagram',
			title: 'Code quality',
			color: '#7e57c2',
		}),
		vue: createPreset({
			icon: 'mdi-vuejs',
			title: 'Vue',
			color: '#42b883',
		}),
		vuetify: createPreset({
			icon: 'mdi-view-dashboard',
			title: 'Vuetify',
			color: '#1867c0',
		}),
		vite: createPreset({
			icon: 'mdi-flash',
			title: 'Vite',
			color: '#646cff',
		}),
		vueRouter: createPreset({
			icon: 'mdi-routes',
			title: 'Vue Router',
			color: '#673ab7',
		}),
		axios: createPreset({
			icon: 'mdi-web',
			title: 'Axios',
			color: '#5a29e4',
		}),
		leaflet: createPreset({
			icon: 'mdi-map',
			title: 'Leaflet',
			color: '#199900',
		}),
		nodeJs: createPreset({
			icon: 'mdi-nodejs',
			title: 'Node.js',
			color: '#339933',
		}),
		esbuild: createPreset({
			icon: 'mdi-hammer-wrench',
			title: 'esbuild',
			color: '#ffcf00',
		}),
		nodemailer: createPreset({
			icon: 'mdi-email',
			title: 'Nodemailer',
			color: '#1e88e5',
		}),
		swaggerUi: createPreset({
			icon: 'mdi-api',
			title: 'Swagger UI',
			color: '#85ea2d',
		}),
		security: createPreset({
			icon: 'mdi-shield-lock',
			title: 'Security',
			color: '#f9a825',
		}),
		python: createPreset({
			icon: 'mdi-language-python',
			title: 'Python',
			color: '#3776ab',
		}),
		configFile: createPreset({
			icon: 'mdi-file-cog',
			title: 'Config',
			color: '#fb8c00',
		}),
	}
	return { createPreset, iconListPresets }
}
