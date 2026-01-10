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
					href="https://github.com/Toomas633/Homepage"
					icon="mdi-github" />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="Swagger"
					href="https://toomas633.com/api/swagger-ui"
					:image="swaggerIcon" />
			</v-col>
		</v-row>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Overview" centered />
		<p class="mb-4">
			Toomas633's Dungeon is a full-stack web application showcasing personal
			projects, technical skills, and interactive features. It combines a modern
			Vue frontend with a robust Node.js backend, designed for performance,
			maintainability, and scalability.
		</p>
		<LinkableTitle h2 title="Key features" />
		<ul class="multicolumn feature-list">
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-palette"
					color="#9c27b0"
					aria-hidden="true" />
				<span>
					<b>Modern UI:</b> Responsive design with Vuetify Material components.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-email"
					color="#1e88e5"
					aria-hidden="true" />
				<span>
					<b>Contact system:</b>
					Email service with rate limiting and validation.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-map"
					color="#43a047"
					aria-hidden="true" />
				<span><b>Interactive maps:</b> Leaflet integration for maps.</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-chart-bar"
					color="#00acc1"
					aria-hidden="true" />
				<span>
					<b>Project showcase:</b> Dynamic galleries with GitHub integration.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-shield-lock"
					color="#f9a825"
					aria-hidden="true" />
				<span>
					<b>Security:</b>
					CORS protection, rate limiting, and security headers.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-docker"
					color="#2496ed"
					aria-hidden="true" />
				<span>
					<b>Containerized:</b> Docker support with multi-stage builds.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-check-bold"
					color="#2e7d32"
					aria-hidden="true" />
				<span><b>Tested:</b> Comprehensive coverage with Vitest.</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-chart-line"
					color="#7e57c2"
					aria-hidden="true" />
				<span>
					<b>Quality:</b>
					SonarCloud integration for code quality analysis.
				</span>
			</li>
			<li class="feature-item">
				<v-icon
					class="feature-bullet"
					icon="mdi-book-open-page-variant"
					color="#fb8c00"
					aria-hidden="true" />
				<span>
					<b>API docs:</b> Interactive Swagger UI for API exploration.
				</span>
			</li>
		</ul>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Tech stack" centered />
		<v-row class="mt-2" align="start">
			<v-col cols="12" md="6">
				<LinkableTitle h2 title="Frontend" />
				<ul class="feature-list">
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-vuejs"
							color="#42b883"
							aria-hidden="true" />
						<span><b>Framework:</b> Vue 3 with Composition API</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-language-typescript"
							color="#3178c6"
							aria-hidden="true" />
						<span><b>Language:</b> TypeScript</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-view-dashboard"
							color="#1867c0"
							aria-hidden="true" />
						<span><b>UI library:</b> Vuetify</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-flash"
							color="#646cff"
							aria-hidden="true" />
						<span><b>Build tool:</b> Vite</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-routes"
							color="#673ab7"
							aria-hidden="true" />
						<span><b>Router:</b> Vue Router</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-web"
							color="#5a29e4"
							aria-hidden="true" />
						<span><b>HTTP client:</b> Axios</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-map"
							color="#199900"
							aria-hidden="true" />
						<span><b>Maps:</b> Leaflet</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-test-tube"
							color="#6e9f18"
							aria-hidden="true" />
						<span><b>Testing:</b> Vitest</span>
					</li>
				</ul>
			</v-col>

			<v-col cols="12" md="6">
				<LinkableTitle h2 title="Backend" />
				<ul class="feature-list">
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-nodejs"
							color="#339933"
							aria-hidden="true" />
						<span><b>Runtime:</b> Node.js</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-rocket-launch"
							color="#424242"
							aria-hidden="true" />
						<span><b>Framework:</b> Express.js</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-language-typescript"
							color="#3178c6"
							aria-hidden="true" />
						<span><b>Language:</b> TypeScript (ESM)</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-hammer-wrench"
							color="#ffcf00"
							aria-hidden="true" />
						<span><b>Build tool:</b> esbuild</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-email"
							color="#1e88e5"
							aria-hidden="true" />
						<span><b>Email:</b> Nodemailer</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-shield-lock"
							color="#f9a825"
							aria-hidden="true" />
						<span><b>Security:</b> CORS + rate limiting</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-api"
							color="#85ea2d"
							aria-hidden="true" />
						<span><b>API docs:</b> Swagger UI</span>
					</li>
					<li class="feature-item">
						<v-icon
							class="feature-bullet"
							icon="mdi-test-tube"
							color="#6e9f18"
							aria-hidden="true" />
						<span><b>Testing:</b> Vitest + Supertest</span>
					</li>
				</ul>
			</v-col>
		</v-row>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />

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
						<ul class="ml-4 mb-0">
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
						<ul class="ml-4 mb-0">
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
			<LinkableTitle h2 title="Project structure" />
			<v-treeview
				:items="structure"
				item-value="title"
				class="bg-secondary mt-2"
				expand-icon="mdi-folder"
				collapse-icon="mdi-folder-open"
				density="compact"
				fluid
				open-all
				open-on-click
				rounded>
				<template #prepend="{ item }">
					<v-icon v-if="!(item.file === 'folder' && item.children?.length)">
						{{ fileIcons[item.file as FileType] }}
					</v-icon>
				</template>
				<template #title="{ item }">
					<span>{{ item.title }}</span>
					<span v-if="item.comment" style="opacity: 0.5">
						({{ item.comment }})
					</span>
				</template>
			</v-treeview>
		</v-card>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import { fileIcons } from '@/constants/fileIcons'
import { FileType } from '@/enums/fileType'
import swaggerIcon from '@/assets/icons/logos/swagger.svg'

const repo = 'Toomas633/Homepage'

interface TreeItem {
	title: string
	file: FileType
	comment?: string
	children?: TreeItem[]
}

const structure: TreeItem[] = [
	{
		title: 'homepage',
		file: FileType.Folder,
		children: [
			{
				title: 'frontend',
				file: FileType.Folder,
				comment: 'Vue 3 + TypeScript + Vuetify',
				children: [
					{
						title: 'src',
						file: FileType.Folder,
						comment: 'App source code',
						children: [
							{ title: 'components', file: FileType.Folder },
							{ title: 'views', file: FileType.Folder },
							{ title: 'router', file: FileType.Folder },
							{ title: 'services', file: FileType.Folder },
							{ title: 'helpers', file: FileType.Folder },
							{ title: 'types', file: FileType.Folder },
							{ title: 'assets', file: FileType.Folder },
						],
					},
					{ title: 'tests', file: FileType.Folder, comment: 'Vitest tests' },
					{ title: 'vite.config.ts', file: FileType.Config },
					{ title: 'vitest.config.ts', file: FileType.Config },
					{ title: 'tsconfig.json', file: FileType.Config },
					{ title: 'package.json', file: FileType.Code },
				],
			},
			{
				title: 'backend',
				file: FileType.Folder,
				comment: 'Express.js + TypeScript (ESM)',
				children: [
					{
						title: 'src',
						file: FileType.Folder,
						comment: 'API source code',
						children: [
							{ title: 'routes', file: FileType.Folder },
							{ title: 'services', file: FileType.Folder },
							{ title: 'middleware', file: FileType.Folder },
							{ title: 'config', file: FileType.Folder },
							{ title: 'types', file: FileType.Folder },
							{ title: 'utils', file: FileType.Folder },
							{ title: 'app.ts', file: FileType.Code, comment: 'Server entry' },
						],
					},
					{
						title: 'tests',
						file: FileType.Folder,
						comment: 'Vitest + Supertest',
					},
					{ title: 'tsconfig.json', file: FileType.Config },
					{ title: 'esbuild.config.js', file: FileType.Config },
					{ title: 'package.json', file: FileType.Code },
				],
			},
			{
				title: 'docs',
				file: FileType.Folder,
				comment: 'Project documentation',
			},
			{ title: 'changelog', file: FileType.Folder, comment: 'Release notes' },
			{ title: 'Dockerfile', file: FileType.Config },
			{ title: 'docker-compose.yml', file: FileType.Config },
			{ title: 'nginx.conf', file: FileType.Config },
			{ title: 'ecosystem.config.cjs', file: FileType.Config },
			{ title: 'sonar-project.properties', file: FileType.Config },
			{ title: 'Homepage.code-workspace', file: FileType.Config },
			{ title: 'README.md', file: FileType.Txt },
			{ title: 'CHANGELOG.md', file: FileType.Txt },
			{ title: 'CONTRIBUTING.md', file: FileType.Txt },
			{ title: 'LICENCE', file: FileType.License },
		],
	},
]
</script>

<style scoped lang="scss">
.feature-list {
	list-style: none;
	padding-left: 0;
	margin-left: 0;
}

.feature-item {
	display: flex;
	gap: 0.6rem;
	align-items: flex-start;
	break-inside: avoid;
}

.feature-bullet {
	min-width: 1.25rem;
	line-height: 1.4;
}
</style>
