<template>
	<v-navigation-drawer
		v-model:rail="isRail"
		data-primary-drawer
		width="3.438rem"
		class="app-navbar"
		permanent
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave">
		<v-list class="nav-brand-list">
			<v-list-item
				class="nav-brand"
				prepend-avatar="/logo.svg"
				title="Toomas633's Dungeon"
				:subtitle="`${APP_VERSION} ${APP_ENV !== 'production' ? APP_ENV.toLocaleUpperCase() : ''}`"
				value="home"
				:active="false"
				to="/" />
		</v-list>
		<v-list
			v-model:selected="navSelection"
			class="nav-list"
			density="compact"
			nav>
			<v-list-item
				class="nav-item"
				prepend-icon="mdi-toolbox"
				title="Projects"
				value="projects" />
			<v-list-item
				class="nav-item"
				prepend-icon="mdi-controller"
				title="Game servers"
				value="servers" />
			<v-list-item
				class="nav-item"
				prepend-icon="mdi-play-box-multiple"
				title="Demos"
				value="demos" />
			<v-list-item
				class="nav-item"
				prepend-icon="mdi-card-account-mail"
				title="Contact"
				value="contact"
				to="/contact" />
			<v-list-item
				class="nav-item"
				prepend-icon="mdi-hand-coin"
				title="Donate"
				value="donate"
				to="/donate" />
		</v-list>
		<template #append>
			<div v-if="fullyExpanded" class="nav-stack">
				<span class="nav-stack-label">Built with</span>
				<div class="nav-stack-row">
					<v-tooltip :text="`Vue ${VUE_VERSION}`" location="right">
						<template #activator="{ props }">
							<v-img
								v-bind="props"
								:src="Vue"
								class="nav-stack-item vue"
								alt="Vue icon"
								max-height="32"
								max-width="32" />
						</template>
					</v-tooltip>
					<v-tooltip :text="`Vuetify ${VUETIFY_VERSION}`" location="right">
						<template #activator="{ props }">
							<v-img
								v-bind="props"
								:src="Vuetify"
								class="nav-stack-item vuetify"
								alt="Vuetify icon"
								max-height="32"
								max-width="32" />
						</template>
					</v-tooltip>
					<v-tooltip :text="`Backend ${backendVersion}`" location="right">
						<template #activator="{ props }">
							<v-img
								v-bind="props"
								:src="NodeJS"
								class="nav-stack-item nodejs"
								alt="Node.js icon"
								max-height="32"
								max-width="32" />
						</template>
					</v-tooltip>
				</div>
			</div>
			<v-list class="nav-list" density="compact" nav>
				<v-list-item
					class="nav-item"
					:title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
					:prepend-icon="
						isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
					"
					@click="changeTheme" />
			</v-list>
			<v-list
				v-if="fullyExpanded"
				v-model:selected="navSelection"
				class="nav-legal"
				density="compact"
				nav>
				<v-list-item
					class="nav-legal-item"
					subtitle="Privacy Policy"
					value="privacy"
					to="/privacy" />
				<v-list-item
					class="nav-legal-item"
					subtitle="Terms of Service"
					value="tos"
					to="/tos" />
			</v-list>
			<div v-if="fullyExpanded" class="nav-social">
				<v-btn
					icon="mdi-rocket-launch"
					href="https://thingiverse.com/toomas633"
					class="social-btn"
					color="blue"
					size="small"
					variant="text"
					aria-label="Thingiverse link" />
				<v-btn
					icon="mdi-twitter"
					href="https://x.com/Toomas633"
					class="social-btn"
					color="light-blue"
					size="small"
					variant="text"
					aria-label="Twitter link" />
				<v-btn
					icon="mdi-reddit"
					href="https://reddit.com/u/toomas633"
					class="social-btn"
					color="deep-orange"
					size="small"
					variant="text"
					aria-label="Reddit link" />
				<v-btn
					icon="mdi-github"
					href="https://github.com/Toomas633/"
					class="social-btn"
					size="small"
					variant="text"
					aria-label="GitHub link" />
				<v-btn
					icon="mdi-email-edit"
					href="mailto:mailto:info@toomas633.com"
					color="red"
					class="social-btn"
					size="small"
					variant="text"
					aria-label="Email link" />
				<PayPalBtn />
			</div>
		</template>
	</v-navigation-drawer>
	<v-navigation-drawer
		v-model="secondDrawer"
		data-secondary-drawer
		temporary
		floating
		class="nav-sub-drawer"
		:scrim="false"
		touchless>
		<div class="nav-sub-head">
			<v-icon :icon="sectionIcon" size="18" class="nav-sub-head-icon" />
			<span class="nav-sub-head-label">{{ sectionLabel }}</span>
		</div>
		<v-list
			v-model:selected="secondSelection"
			class="nav-sub-list"
			density="compact"
			nav>
			<v-list-item
				v-for="item in drawerItems"
				:key="item.title"
				class="nav-sub-item"
				:value="item.href?.split('/')[2]"
				:to="!item.external ? item.href : undefined"
				:href="item.external ? item.href : undefined"
				:title="item.title"
				:subtitle="item.subtitle"
				:prepend-icon="item.icon"
				:append-icon="item.external ? 'mdi-open-in-new' : undefined"
				@click="handleSecondClick(item.href?.split('/')[2])" />
		</v-list>
	</v-navigation-drawer>
</template>
<script setup lang="ts">
import {
	APP_ENV,
	APP_VERSION,
	VUE_VERSION,
	VUETIFY_VERSION,
} from '@/constants/env'
import router from '@/router'
import { MenuItem } from '@/types/menuItem'
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Vue from '@/assets/icons/logos/vue.svg'
import Vuetify from '@/assets/icons/logos/vuetify.svg'
import NodeJS from '@/assets/icons/logos/nodejs-logo.svg'
import useThemeMixin from '@/helpers/themeMixin'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import { projectRoutes } from '@/router/projects'
import { demoRoutes } from '@/router/demos'
import { RouteRecord } from '@/types/route'
import { serversRoutes } from '@/router/servers'
import { getBackendVersion } from '@/services/backendService'

const isRail = ref(true)
const fullyExpanded = ref(false)
const secondDrawer = ref(false)
const navSelection = ref<string[]>([])
const secondSelection = ref<string[]>([])
const drawerItems = ref<MenuItem[]>([])
const backendVersion = ref<string>('Loading...')

let expandTimer: ReturnType<typeof setTimeout> | undefined

const { isDark, toggleTheme } = useThemeMixin()

const sectionIcons: Record<string, string> = {
	projects: 'mdi-toolbox',
	servers: 'mdi-controller',
	demos: 'mdi-play-box-multiple',
}

const sectionLabel = computed(() =>
	(navSelection.value[0] ?? '').toLocaleUpperCase()
)

const sectionIcon = computed(
	() => sectionIcons[navSelection.value[0]] ?? 'mdi-folder'
)

watch(isRail, (val) => {
	if (val) {
		if (expandTimer) clearTimeout(expandTimer)
		if (!secondDrawer.value) resetSelection()
		fullyExpanded.value = false
	} else {
		if (expandTimer) clearTimeout(expandTimer)
		expandTimer = setTimeout(() => {
			fullyExpanded.value = true
		}, 200)
	}
})

watch(secondDrawer, (isOpen) => {
	if (isOpen) {
		isRail.value = true
	}
})

watch(
	router.currentRoute,
	(route) => {
		const parts = route.path.split('/')
		navSelection.value = parts[1] ? [parts[1]] : ['home']
		secondSelection.value = parts[2] ? [parts[2]] : []
	},
	{ immediate: true }
)

watch(secondSelection, (newVal, oldVal) => {
	if (oldVal[0] === newVal[0]) {
		secondDrawer.value = false
	}
})

watch(navSelection, (val, oldVal) => {
	const selected = val[0]

	if (oldVal[0] && !selected) {
		navSelection.value = oldVal
		return
	}

	const expandableSections = ['projects', 'servers', 'demos']

	if (!selected || !expandableSections.includes(selected)) {
		isRail.value = true
		secondDrawer.value = false
		drawerItems.value = []
		return
	}

	switch (selected) {
		case 'projects':
			drawerItems.value = projectRoutes.map((route) =>
				mapRouteToMenuItem(route)
			)
			break
		case 'servers':
			drawerItems.value = serversRoutes.map((route) =>
				mapRouteToMenuItem(route)
			)
			break
		case 'demos':
			drawerItems.value = [
				...demoRoutes.map((route) => mapRouteToMenuItem(route)),
				{
					title: 'TalTech',
					href: 'https://github.com/Toomas633?tab=repositories&q=TalTech&type=&language=&sort=',
					icon: 'mdi-school',
					subtitle: 'GitHub',
					external: true,
				},
			]
			break
	}

	secondDrawer.value = drawerItems.value.length > 0
})

onMounted(async () => {
	document.addEventListener('click', handleGlobalClick, { passive: true })
	document.addEventListener('touchstart', handleGlobalClick, { passive: true })
	backendVersion.value = await getBackendVersion()
})

function handleMouseEnter() {
	isRail.value = false

	if (secondDrawer.value) {
		secondDrawer.value = false
	}
}

function handleMouseLeave() {
	isRail.value = true
}

function handleSecondClick(val?: string) {
	secondSelection.value = [val ?? '']
}

function changeTheme() {
	toggleTheme()
	if (isMobile && !fullyExpanded.value) {
		isRail.value = true
	}
}

function eventTargetElement(e: MouseEvent | TouchEvent): Element | null {
	const t = (e.target as Node) ?? null
	if (!t) return null
	return t instanceof Element ? t : t.parentElement
}

function handleGlobalClick(e: MouseEvent | TouchEvent) {
	const el = eventTargetElement(e)
	const insidePrimary = !!(el && el.closest('[data-primary-drawer]'))
	const insideSecondary = !!(el && el.closest('[data-secondary-drawer]'))

	if (!insidePrimary && !insideSecondary && secondDrawer.value) {
		secondDrawer.value = false
	}

	if (!insidePrimary && !insideSecondary) {
		resetSelection()
	}
}

function resetSelection() {
	const parts = router.currentRoute.value.path.split('/')
	navSelection.value = parts[1] ? [parts[1]] : ['home']
	secondSelection.value = parts[2] ? [parts[2]] : []
}

function mapRouteToMenuItem(route: RouteRecord): MenuItem {
	return {
		title: route.meta.title,
		href: route.path,
		icon: route.meta.icon ?? 'mdi-folder',
	} as MenuItem
}

onBeforeUnmount(() => {
	document.removeEventListener('click', handleGlobalClick)
	document.removeEventListener('touchstart', handleGlobalClick)
})
</script>
<style scoped lang="scss">
/* --------------------------------------------------------------------------
   Panel shell
   -------------------------------------------------------------------------- */

.app-navbar,
.nav-sub-drawer {
	background-color: rgb(var(--v-theme-surface)) !important;
	background-image: linear-gradient(
		180deg,
		rgba(var(--v-theme-on-surface), 0.05) 0%,
		rgba(var(--v-theme-on-surface), 0) 45%
	) !important;
	color: rgb(var(--v-theme-on-surface)) !important;
	border-color: var(--surface-line) !important;
}

.app-navbar {
	border-right: 0.0625rem solid var(--surface-line) !important;
	box-shadow: var(--shadow-md);
}

.app-navbar::before {
	content: '';
	position: absolute;
	inset: 0 0 auto;
	height: 14rem;
	pointer-events: none;
	background: radial-gradient(
		18rem 12rem at 0% 0%,
		rgba(var(--v-theme-primary), 0.14) 0%,
		transparent 70%
	);
}

/* stylelint-disable selector-class-pattern */
.app-navbar :deep(.v-navigation-drawer__content) {
	overflow-x: hidden;
}
/* stylelint-enable selector-class-pattern */

/* --------------------------------------------------------------------------
   Brand
   -------------------------------------------------------------------------- */

.nav-brand-list {
	background: transparent !important;
	padding-block: 0.25rem;
}

.nav-brand :deep(.v-avatar) {
	border-radius: var(--radius-md);
	background-color: rgba(var(--v-theme-primary), 0.12);
	border: 0.0625rem solid rgba(var(--v-theme-primary), 0.3);
	transition: box-shadow var(--speed-base) var(--ease-out);
}

.nav-brand:hover :deep(.v-avatar) {
	box-shadow: 0 0 0.75rem rgba(var(--v-theme-primary), 0.45);
}

.nav-brand :deep(.v-list-item-title) {
	font-weight: 800;
	letter-spacing: 0.01em;
}

.nav-brand :deep(.v-list-item-subtitle) {
	display: inline-block;
	margin-top: 0.25rem;
	padding: 0.0625rem 0.5rem;
	border-radius: var(--radius-pill);
	background-color: rgba(var(--v-theme-on-surface), 0.08);
	font-size: 0.625rem;
	font-weight: 700;
	letter-spacing: 0.09em;
	opacity: 1;
}

/* --------------------------------------------------------------------------
   Navigation items
   -------------------------------------------------------------------------- */

.nav-list {
	background: transparent !important;
}

.nav-item {
	position: relative;
	border-radius: var(--radius-md) !important;
	margin-block: 0.0625rem;
	transition:
		background-color var(--speed-fast) var(--ease-out),
		color var(--speed-fast) var(--ease-out);
}

.nav-item:hover {
	background-color: rgba(var(--v-theme-on-surface), 0.07);
}

/* stylelint-disable selector-class-pattern */
.nav-item.v-list-item--active {
	background-color: rgba(var(--v-theme-primary), 0.14);
}

.nav-item.v-list-item--active :deep(.v-list-item-title),
.nav-item.v-list-item--active :deep(.v-icon) {
	color: rgb(var(--v-theme-primary));
}

.nav-item :deep(.v-list-item__overlay) {
	opacity: 0 !important;
}
/* stylelint-enable selector-class-pattern */

/* --------------------------------------------------------------------------
   Tech stack badges
   -------------------------------------------------------------------------- */

.nav-stack {
	padding: 0.5rem 0 1rem;
	text-align: center;
	border-top: 0.0625rem solid var(--surface-line);
}

.nav-stack-label {
	display: block;
	margin-bottom: 0.625rem;
	font-size: 0.625rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	opacity: 0.45;
}

.nav-stack-row {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
}

.nav-stack-item {
	transition: filter var(--speed-base) var(--ease-out);
	cursor: help;
}

.vuetify:hover {
	filter: drop-shadow(0 0 0.5rem #1697f6);
}

.vue:hover {
	filter: drop-shadow(0 0 0.5rem #41b883);
}

.nodejs:hover {
	filter: drop-shadow(0 0 0.5rem #539e43);
}

/* --------------------------------------------------------------------------
   Legal links & socials
   -------------------------------------------------------------------------- */

.nav-legal {
	display: flex;
	justify-content: center;
	gap: 0.25rem;
	padding: 0 0.5rem;
	background: transparent !important;
}

.nav-legal-item {
	border-radius: var(--radius-sm) !important;
	min-height: 0 !important;
	padding: 0.25rem 0.5rem !important;
}

.nav-legal-item :deep(.v-list-item-subtitle) {
	font-size: 0.6875rem;
	opacity: 0.55;
	transition: opacity var(--speed-fast) var(--ease-out);
}

.nav-legal-item:hover :deep(.v-list-item-subtitle) {
	opacity: 1;
}

.nav-social {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.75rem 0.5rem 1.25rem;
}

.social-btn {
	border-radius: var(--radius-pill);
	opacity: 0.75;
	transition:
		opacity var(--speed-fast) var(--ease-out),
		background-color var(--speed-fast) var(--ease-out);
}

.social-btn:hover {
	opacity: 1;
	background-color: rgba(var(--v-theme-on-surface), 0.08);
}

/* --------------------------------------------------------------------------
   Secondary (section) drawer
   -------------------------------------------------------------------------- */

.nav-sub-drawer {
	border-right: 0.0625rem solid var(--surface-line) !important;
	box-shadow: var(--shadow-lg);
}

.nav-sub-head {
	position: sticky;
	top: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1rem;
	background-color: rgb(var(--v-theme-surface));
	border-bottom: 0.0625rem solid var(--surface-line);
}

.nav-sub-head-icon {
	color: rgb(var(--v-theme-primary));
}

.nav-sub-head-label {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	opacity: 0.72;
}

.nav-sub-list {
	background: transparent !important;
	padding: 0.5rem 0.5rem 1rem;
}

.nav-sub-item {
	position: relative;
	border-radius: var(--radius-md) !important;
	margin-block: 0.125rem;
	transition:
		background-color var(--speed-fast) var(--ease-out),
		color var(--speed-fast) var(--ease-out);
}

.nav-sub-item:hover {
	background-color: rgba(var(--v-theme-on-surface), 0.07);
}

/* stylelint-disable selector-class-pattern */
.nav-sub-item.v-list-item--active {
	background-color: rgba(var(--v-theme-primary), 0.14);
}

.nav-sub-item.v-list-item--active :deep(.v-list-item-title),
.nav-sub-item.v-list-item--active :deep(.v-icon) {
	color: rgb(var(--v-theme-primary));
}

.nav-sub-item :deep(.v-list-item__overlay) {
	opacity: 0 !important;
}
/* stylelint-enable selector-class-pattern */
</style>
