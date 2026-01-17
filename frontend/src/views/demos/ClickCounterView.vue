<template>
	<v-container>
		<h1 class="text-center">Click Counter</h1>
		<StatsAndChips hide-langs hide-version :repo="repo" />
		<p class="text-center">
			A simple Vue 3 application that demonstrates a click counter with theme
			toggling functionality. The project uses Vuetify for UI components and
			Jest with Puppeteer for end-to-end testing.
		</p>
		<v-row class="d-block d-sm-flex my-1" justify="center">
			<v-col>
				<StatsAndChips :repo="repo" hide-chips />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/click-counter"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<v-img
			:src="Preview"
			alt="Page preview gif"
			style="cursor: zoom-in"
			@click="openImageInNewTab(Preview)" />
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" multicolumn />
		<LinkableTitle h1 title="Running" centered />
		<LinkableTitle h2 title="Installation" hide-divider />
		<p>
			Install dependencies:
			<CodeBlock code="yarn install" />
		</p>
		<LinkableTitle h2 title="Development" />
		<p>
			Start the development server:
			<CodeBlock code="yarn dev" />
			The application will be available at
			<LinkComponent href="http://localhost:5173" />.
		</p>
		<LinkableTitle h2 title="Build" />
		<p>
			To build the project for production:
			<CodeBlock code="yarn build" />
			The production-ready files will be in the dist directory.
		</p>
		<LinkableTitle h2 title="Testing" />
		<p>
			Build the project, serve with yarn preview and then run the tests:
			<CodeBlock :code="testCode" />
			This will execute the Jest-Puppeteer test suite.
		</p>
		<LinkableTitle h2 title="Linting and Formatting" />
		<ul>
			<li>Lint the code:<CodeBlock code="yarn lint" /></li>
			<li>
				Format the code with Prettier:
				<CodeBlock code="yarn prettier-fix" />
			</li>
		</ul>
	</v-container>
	<TableOfContents />
</template>
<script setup lang="ts">
import Preview from '@/assets/images/click-counter/preview.gif'
import useIconListMixin from '@/helpers/iconListMixin'
import useImageMixin from '@/helpers/imageMixin'
import type { IconListItem } from '@/types/iconList'

const { openImageInNewTab } = useImageMixin()
const { iconListPresets } = useIconListMixin()

const repo = 'toomas633/click-counter'

const features: IconListItem[] = [
	{
		icon: 'mdi-gesture-tap',
		color: '#00acc1',
		title: 'Click counter',
		text: 'Increment, decrement, and reset the counter.',
	},
	{
		icon: 'mdi-theme-light-dark',
		color: '#7e57c2',
		title: 'Theme toggle',
		text: 'Switch between light and dark themes.',
	},
	{
		icon: 'mdi-view-dashboard',
		color: '#1867c0',
		title: 'Responsive design',
		text: 'Built with Vuetify for a modern and responsive UI.',
	},
	iconListPresets.typeScript({
		title: 'TypeScript support',
		text: 'Fully typed with TypeScript for better developer experience.',
	}),
	iconListPresets.testing({
		title: 'Unit and E2E testing',
		text: 'Includes Jest and Puppeteer for testing.',
	}),
]
const testCode = `yarn build
yarn preview #serves build webpage from dist on port 4123
yarn test`
</script>
