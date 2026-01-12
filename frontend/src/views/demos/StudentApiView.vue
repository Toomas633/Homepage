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
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" multicolumn />
		<LinkableTitle h1 title="Running" centered />
		<LinkableTitle h2 title="Installation" hide-divider />
		<p>
			1. Clone the repository from GitHub:
			<InlineCode
				code="git clone https://github.com/Toomas633/student-api" />.<br />
			2. Install dependencies by running <InlineCode code="yarn install" />.
		</p>
		<LinkableTitle h2 title="Scripts" />
		<p>
			The following yarn scripts are available defined in
			<InlineCode code="package.json" />:
		</p>
		<ul>
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
		<LinkableTitle h1 title="API endpoints" centered />
		<p><b>Base URL:</b> <LinkComponent href="http://localhost:3000" /></p>
		<p><b>Students</b></p>
		<ul>
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
		<LinkableTitle h1 title="Project structure" centered />
		<v-card class="pa-4" elevation="4">
			<TreeviewComponent :items="structure" :open-all="true" />
		</v-card>
	</v-container>
	<TableOfContents />
</template>
<script setup lang="ts">
import { FileType } from '@/enums/fileType'
import useIconListMixin from '@/helpers/iconListMixin'
import useTreeMixin from '@/helpers/treeMixin'
import type { IconListItem } from '@/types/iconList'
import type { TreeItem } from '@/types/treeview'

const { iconListPresets } = useIconListMixin()
const { treeItem, treePresets } = useTreeMixin()

const repo = 'toomas633/student-api'

const features: IconListItem[] = [
	{
		icon: 'mdi-database-edit',
		color: '#00acc1',
		title: 'CRUD operations',
		text: 'Create, Read, Update, and Delete students.',
	},
	iconListPresets.typeScript({
		text: 'Strongly typed codebase.',
	}),
	iconListPresets.express({
		text: 'Lightweight and fast web framework.',
	}),
	iconListPresets.testing({
		text: 'Includes integration tests using Jest.',
	}),
	iconListPresets.codeQuality({
		text: 'Configured with ESLint and Prettier for consistent code formatting and linting.',
	}),
]

const studentData = `{
  firstName: string
  lastName: string
  email: string
  studentNumber: string
}`

const structure: TreeItem[] = [
	{
		title: 'student-api',
		file: FileType.Folder,
		comment: '',
		children: [
			treePresets.vscodeFolder(),
			treeItem.folder('specs', { comment: 'Jest test files' }),
			treePresets.srcFolder('Source files', [
				treeItem.folder('constants', {
					comment: 'Constants for messages and errors',
				}),
				treeItem.folder('controllers', { comment: 'Express controllers' }),
				treeItem.folder('models', { comment: 'TypeScript interfaces' }),
				treeItem.folder('routes', { comment: 'API routes' }),
				treeItem.folder('services', {
					comment: 'Business logic and data handling',
				}),
				treeItem.file('index.ts', FileType.Code, 'App entry point'),
			]),
			treeItem.file('.eslintrc.json', FileType.Config, 'ESLint configuration'),
			treeItem.file('.gitignore', FileType.Config),
			treeItem.file('.prettierrc', FileType.Config, 'Prettier configuration'),
			treeItem.file('LICENSE', FileType.License),
			treePresets.readme(),
			treeItem.file('nodemon.json', FileType.Config, 'Nodemon configuration '),
			treePresets.packageJson('Project metadata and scripts'),
			treePresets.tsconfigJson('TypeScript configuration'),
			treeItem.file('yarn.lock', FileType.Lock),
		],
	},
]
</script>
