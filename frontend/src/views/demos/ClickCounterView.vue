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
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Features" centered />
		<ul class="ml-4 multicolumn">
			<li>
				<b>Click Counter:</b> Increment, decrement, and reset the counter.
			</li>
			<li><b>Theme Toggle:</b> Switch between light and dark themes.</li>
			<li>
				<b>Responsive Design:</b> Built with Vuetify for a modern and responsive
				UI.
			</li>
			<li>
				<b>TypeScript Support:</b> Fully typed with TypeScript for better
				developer experience.
			</li>
			<li>
				<b>Unit and E2E Testing:</b> Includes Jest and Puppeteer for testing.
			</li>
		</ul>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Running" centered />
		<LinkableTitle h2 title="Installation" />
		<p>
			Install dependencies:
			<CodeBlock code="yarn install" />
		</p>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Development" />
		<p>
			Start the development server:
			<CodeBlock code="yarn dev" />
			The application will be available at
			<LinkComponent href="http://localhost:5173" />.
		</p>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Build" />
		<p>
			To build the project for production:
			<CodeBlock code="yarn build" />
			The production-ready files will be in the dist directory.
		</p>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Testing" />
		<p>
			Build the project, serve with yarn preview and then run the tests:
			<CodeBlock :code="testCode" />
			This will execute the Jest-Puppeteer test suite.
		</p>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Linting and Formatting" />
		<ul class="ml-4">
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
import useImageMixin from '@/helpers/imageMixin'

const { openImageInNewTab } = useImageMixin()
const repo = 'toomas633/click-counter'
const testCode = `yarn build
yarn preview #serves build webpage from dist on port 4123
yarn test`
</script>
