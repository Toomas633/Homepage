<template>
	<v-container>
		<h1 class="text-center">Homepage</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p class="text-center">
			A modern full-stack personal projects homepage built with Vue 3,
			TypeScript, and Node.js.
		</p>
		<v-row class="d-block d-sm-flex my-1" justify="center">
			<v-col>
				<StatsAndChips :repo="repo" hide-chips />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/homepage"
					icon="mdi-github" />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="Swagger"
					href="https://toomas633.com/api/swagger-ui"
					:image="swaggerIcon" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Overview" centered />
		<p class="mb-4">
			Toomas633's Dungeon is a full-stack web application showcasing personal
			projects, technical skills, and interactive features. It combines a modern
			Vue frontend with a robust Node.js backend, designed for performance,
			maintainability, and scalability.
		</p>
		<LinkableTitle h2 title="Key features" />
		<IconList :items="keyFeatures" multicolumn />
		<LinkableTitle h1 title="Tech stack" centered />
		<v-row class="mt-2" align="start">
			<v-col cols="12" md="6">
				<LinkableTitle h2 title="Frontend" hide-divider />
				<IconList :items="frontendStack" />
			</v-col>
			<v-col cols="12" md="6">
				<LinkableTitle h2 title="Backend" hide-divider />
				<IconList :items="backendStack" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Architecture" centered />
		<v-card class="pa-4" elevation="4">
			<p class="mb-0 text-center">
				In production, Nginx serves the frontend and proxies API requests to the
				backend.
			</p>
			<v-divider class="my-4" />
			<v-row class="flex-column flex-md-row align-center" justify="center">
				<v-col cols="12" md="3">
					<v-card variant="tonal" class="pa-3" rounded>
						<div class="d-flex align-center justify-space-between">
							<h3 class="text-h6 mb-0">Client</h3>
							<v-icon icon="mdi-web" />
						</div>
						<p class="mb-0 mt-2" style="opacity: 0.9">
							Browser loads the SPA and calls the API.
						</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="1" class="text-center py-0">
					<v-icon
						class="d-none d-md-inline-flex"
						icon="mdi-arrow-right-thick" />
					<v-icon class="d-inline-flex d-md-none" icon="mdi-arrow-down-thick" />
				</v-col>
				<v-col cols="12" md="4">
					<v-card variant="tonal" class="pa-3" rounded>
						<div class="d-flex align-center justify-space-between">
							<h3 class="text-h6 mb-0">Nginx</h3>
							<div class="d-flex align-center" style="gap: 0.25rem">
								<v-chip size="small" color="primary" variant="flat">
									:80
								</v-chip>
								<v-icon icon="mdi-server" />
							</div>
						</div>
						<v-divider class="my-2" />
						<ul>
							<li>Serves static frontend files (<b>Vue dist</b>).</li>
							<li>Proxies API requests (<b>/api/*</b>) to the backend.</li>
						</ul>
					</v-card>
				</v-col>
				<v-col cols="12" md="1" class="text-center py-0">
					<v-icon
						class="d-none d-md-inline-flex"
						icon="mdi-arrow-right-thick" />
					<v-icon class="d-inline-flex d-md-none" icon="mdi-arrow-down-thick" />
				</v-col>
				<v-col cols="12" md="3">
					<v-card variant="tonal" class="pa-3" rounded>
						<div class="d-flex align-center justify-space-between">
							<h3 class="text-h6 mb-0">Backend API</h3>
							<div class="d-flex align-center" style="gap: 0.25rem">
								<v-chip size="small" color="primary" variant="flat">
									:3000
								</v-chip>
								<v-icon icon="mdi-api" />
							</div>
						</div>
						<v-divider class="my-2" />
						<ul>
							<li>Express.js + TypeScript (ESM)</li>
							<li>Email service (Nodemailer)</li>
							<li>Health monitoring</li>
							<li>CORS + rate limiting</li>
						</ul>
					</v-card>
				</v-col>
			</v-row>
			<v-divider class="my-4" />
			<p class="mb-0 text-center">
				PM2 manages Nginx and the backend processes with auto-restart.
			</p>
		</v-card>
		<v-card class="pa-4 mt-4" elevation="4">
			<LinkableTitle h2 title="Project structure" hide-divider />
			<TreeviewComponent :items="structure" />
		</v-card>
		<v-card class="pa-4 mt-4" elevation="4">
			<LinkableTitle h2 title="Documentation" hide-divider />
			<IconList :items="documentationLinks" />
		</v-card>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import useTreeMixin from '@/helpers/treeMixin'
import { FileType } from '@/enums/fileType'
import swaggerIcon from '@/assets/icons/logos/swagger.svg'
import type { IconListItem } from '@/types/iconList'
import type { TreeItem } from '@/types/treeview'
import useIconListMixin from '@/helpers/iconListMixin'

const { iconListPresets } = useIconListMixin()
const { treeItem, treePresets } = useTreeMixin()

const repo = 'Toomas633/homepage'

const documentationLinks: IconListItem[] = [
	{
		icon: 'mdi-file-document-outline',
		color: '#607d8b',
		title: 'Root overview',
		text: 'README.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/README.md',
	},
	iconListPresets.vue({
		title: 'Frontend docs',
		text: 'frontend/README.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/frontend/README.md',
	}),
	iconListPresets.nodeJs({
		title: 'Backend docs',
		text: 'backend/README.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/backend/README.md',
	}),
	{
		icon: 'mdi-book-open-page-variant',
		color: '#fb8c00',
		title: 'API reference',
		text: 'docs/API.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/docs/API.md',
	},
	iconListPresets.swaggerUi({
		title: 'Swagger UI',
		text: 'Swagger UI',
		href: 'https://toomas633.com/api/swagger-ui',
	}),
	{
		icon: 'mdi-rocket-launch',
		color: '#424242',
		title: 'Deployment guide',
		text: 'docs/DEPLOYMENT.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/docs/DEPLOYMENT.md',
	},
	{
		icon: 'mdi-bug',
		color: '#e53935',
		title: 'Troubleshooting',
		text: 'docs/TROUBLESHOOTING.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/docs/TROUBLESHOOTING.md',
	},
	iconListPresets.docker({
		title: 'Docker linting',
		text: 'docs/DOCKER_LINTING.md',
		href: 'https://github.com/Toomas633/homepage/blob/develop/docs/DOCKER_LINTING.md',
	}),
]

const keyFeatures: IconListItem[] = [
	{
		icon: 'mdi-palette',
		color: '#9c27b0',
		title: 'Modern UI',
		text: 'Responsive design with Vuetify Material components.',
	},
	iconListPresets.nodemailer({
		title: 'Contact system',
		text: 'Email service with rate limiting and validation.',
	}),
	{
		icon: 'mdi-map',
		color: '#43a047',
		title: 'Interactive maps',
		text: 'Leaflet integration for maps.',
	},
	{
		icon: 'mdi-chart-bar',
		color: '#00acc1',
		title: 'Project showcase',
		text: 'Dynamic galleries with GitHub integration.',
	},
	iconListPresets.security({
		title: 'Security',
		text: 'CORS protection, rate limiting, and security headers.',
	}),
	iconListPresets.docker({
		title: 'Containerized',
		text: 'Docker support with multi-stage builds.',
	}),
	{
		icon: 'mdi-check-bold',
		color: '#2e7d32',
		title: 'Tested',
		text: 'Comprehensive coverage with Vitest.',
	},
	iconListPresets.codeQuality({
		title: 'Quality',
		text: 'SonarCloud integration for code quality analysis.',
	}),
	iconListPresets.swaggerUi({
		title: 'API docs',
		text: 'Interactive Swagger UI for API exploration.',
	}),
]

const frontendStack: IconListItem[] = [
	iconListPresets.vue({
		title: 'Framework',
		text: 'Vue 3 with Composition API',
	}),
	iconListPresets.typeScript({
		title: 'Language',
		text: 'TypeScript',
	}),
	iconListPresets.vuetify({
		title: 'UI library',
		text: 'Vuetify',
	}),
	iconListPresets.vite({
		title: 'Build tool',
		text: 'Vite',
	}),
	iconListPresets.vueRouter({
		title: 'Router',
		text: 'Vue Router',
	}),
	iconListPresets.axios({
		title: 'HTTP client',
		text: 'Axios',
	}),
	iconListPresets.leaflet({
		title: 'Maps',
		text: 'Leaflet',
	}),
	iconListPresets.testing({
		text: 'Vitest',
	}),
]

const backendStack: IconListItem[] = [
	iconListPresets.nodeJs({
		title: 'Runtime',
		text: 'Node.js',
	}),
	iconListPresets.express({
		color: '#424242',
		title: 'Framework',
		text: 'Express.js',
	}),
	iconListPresets.typeScript({
		title: 'Language',
		text: 'TypeScript (ESM)',
	}),
	iconListPresets.esbuild({
		title: 'Build tool',
		text: 'esbuild',
	}),
	iconListPresets.nodemailer({
		title: 'Email',
		text: 'Nodemailer',
	}),
	iconListPresets.security({
		title: 'Security',
		text: 'CORS + rate limiting',
	}),
	iconListPresets.swaggerUi({
		title: 'API docs',
		text: 'Swagger UI',
	}),
	iconListPresets.testing({
		text: 'Vitest + Supertest',
	}),
]

const structure: TreeItem[] = [
	treeItem.folder('homepage', {
		children: [
			treeItem.folder('frontend', {
				comment: 'Vue 3 + TypeScript + Vuetify',
				children: [
					treePresets.srcFolder('App source code', [
						treeItem.folder('components'),
						treeItem.folder('views'),
						treeItem.folder('router'),
						treeItem.folder('services'),
						treeItem.folder('helpers'),
						treeItem.folder('types'),
						treeItem.folder('assets'),
					]),
					treePresets.testsFolder('Vitest tests'),
					treeItem.file('vite.config.ts', FileType.Config),
					treeItem.file('vitest.config.ts', FileType.Config),
					treePresets.tsconfigJson(),
					treePresets.packageJson(),
				],
			}),
			treeItem.folder('backend', {
				comment: 'Express.js + TypeScript (ESM)',
				children: [
					treePresets.srcFolder('API source code', [
						treeItem.folder('routes'),
						treeItem.folder('services'),
						treeItem.folder('middleware'),
						treeItem.folder('config'),
						treeItem.folder('types'),
						treeItem.folder('utils'),
						treeItem.file('app.ts', FileType.Code, 'Server entry'),
					]),
					treePresets.testsFolder('Vitest + Supertest'),
					treePresets.tsconfigJson(),
					treeItem.file('esbuild.config.js', FileType.Config),
					treePresets.packageJson(),
				],
			}),
			treeItem.folder('docs', { comment: 'Project documentation' }),
			treeItem.folder('changelog', { comment: 'Release notes' }),
			treeItem.file('Dockerfile', FileType.Config),
			treeItem.file('docker-compose.yml', FileType.Config),
			treeItem.file('nginx.conf', FileType.Config),
			treeItem.file('ecosystem.config.cjs', FileType.Config),
			treeItem.file('sonar-project.properties', FileType.Config),
			treeItem.file('Homepage.code-workspace', FileType.Config),
			treePresets.readme(),
			treeItem.file('CHANGELOG.md', FileType.Txt),
			treeItem.file('CONTRIBUTING.md', FileType.Txt),
			treeItem.file('LICENCE', FileType.License),
		],
	}),
]
</script>
