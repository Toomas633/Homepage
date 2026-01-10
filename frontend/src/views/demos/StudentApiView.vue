<template>
	<v-container>
		<h1 class="text-center">Student API</h1>
		<StatsAndChips hide-langs hide-version :repo="repo" />
		<p class="text-center">
			This project is a simple Node.js API built with TypeScript and Express. It
			provides CRUD operations for managing student data.
		</p>
		<v-row class="d-block d-sm-flex my-1" justify="center">
			<v-col>
				<StatsAndChips :repo="repo" hide-chips />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/student-api"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Features" centered />
		<ul class="ml-4 multicolumn">
			<li>
				<b>CRUD Operations:</b> Create, Read, Update, and Delete students.
			</li>
			<li><b>TypeScript:</b> Strongly typed codebase.</li>
			<li><b>Express:</b> Lightweight and fast web framework.</li>
			<li><b>Testing:</b> Includes integration tests using Jest.</li>
			<li>
				<b>Code Quality:</b>
				Configured with ESLint and Prettier for consistent code formatting and
				linting.
			</li>
		</ul>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Running" centered />
		<LinkableTitle h2 title="Installation" />
		<p>
			1. Clone the repository from GitHub:
			<InlineCode
				code="git clone https://github.com/Toomas633/student-api" />.<br />
			2. Install dependencies by running <InlineCode code="yarn install" />.
		</p>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Scripts" />
		<p>
			The following yarn scripts are available defined in
			<InlineCode code="package.json" />:
		</p>
		<ul class="ml-4">
			<li>
				<b>Start Development Server:</b> Runs the server in development mode
				with hot-reloading.<br />
				<InlineCode code="yarn dev" />
			</li>
			<li>
				<b>Build:</b> Compiles TypeScript to JavaScript.<br />
				<InlineCode code="yarn build" />
			</li>
			<li>
				<b>Start Production Server:</b> Runs the compiled server.<br />
				<InlineCode code="yarn start" />
			</li>
			<li>
				<b>Run Tests:</b> Executes the Jest test suite.<br />
				<InlineCode code="yarn test" />
			</li>
			<li>
				<b>Format Code:</b> Formats the codebase using Prettier.<br />
				<InlineCode code="yarn prettier-fix" />
			</li>
		</ul>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="API endpoints" centered />
		<p><b>Base URL:</b> <LinkComponent href="http://localhost:3000" /></p>
		<p><b>Students</b></p>
		<ul class="ml-4 mb-4">
			<li>
				<b>GET<InlineCode code="/student" />:</b> Fetch all students.
			</li>
			<li>
				<b>POST<InlineCode code="/student" />:</b> Add a new student.
			</li>
			<li>
				<b>GET<InlineCode code="/student/:studentNumber" />:</b> Fetch a
				specific student by student number.
			</li>
			<li>
				<b>PATCH<InlineCode code="/student/:studentNumber" />:</b> Update a
				student's details.
			</li>
			<li>
				<b>DELETE<InlineCode code="/student/:studentNumber" />:</b> Delete a
				student.
			</li>
		</ul>
		<p>
			<b>PATCH</b> and <b>POST</b> requests need Student data included in the
			request.<br />
			<b>GET</b> for all students will return an array of Student objects and a
			specific request will only return the given student.
			<CodeBlock :code="studentData" />
		</p>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Project structure" centered />
		<v-card class="pa-4" elevation="4">
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

const repo = 'toomas633/student-api'

const studentData = `{
  firstName: string
  lastName: string
  email: string
  studentNumber: string
}`

const structure = [
	{
		title: 'student-api',
		file: FileType.Folder,
		comment: '',
		children: [
			{ title: '.vscode', file: FileType.Folder, comment: 'VS Code settings' },
			{ title: 'specs', file: FileType.Folder, comment: 'Jest test files' },
			{
				title: 'src',
				file: FileType.Folder,
				comment: 'Source files',
				children: [
					{
						title: 'constants',
						file: FileType.Folder,
						comment: 'Constants for messages and errors',
					},
					{
						title: 'controllers',
						file: FileType.Folder,
						comment: 'Express controllers',
					},
					{
						title: 'models',
						file: FileType.Folder,
						comment: 'TypeScript interfaces',
					},
					{ title: 'routes', file: FileType.Folder, comment: 'API routes' },
					{
						title: 'services',
						file: FileType.Folder,
						comment: 'Business logic and data handling',
					},
					{
						title: 'index.ts',
						file: FileType.Code,
						comment: 'App entry point',
					},
				],
			},
			{
				title: '.eslintrc.json',
				file: FileType.Config,
				comment: 'ESLint configuration',
			},
			{
				title: '.gitignore',
				file: FileType.Config,
			},
			{
				title: '.prettierrc',
				file: FileType.Config,
				comment: 'Prettier configuration',
			},
			{ title: 'LICENSE', file: FileType.License },
			{
				title: 'README.md',
				file: FileType.Txt,
			},
			{
				title: 'nodemon.json',
				file: FileType.Config,
				comment: 'Nodemon configuration ',
			},
			{
				title: 'package.json',
				file: FileType.Code,
				comment: 'Project metadata and scripts',
			},
			{
				title: 'tsconfig.json',
				file: FileType.Config,
				comment: 'TypeScript configuration',
			},
			{ title: 'yarn.lock', file: FileType.Lock },
		],
	},
]
</script>
