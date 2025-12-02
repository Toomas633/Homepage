<template>
	<v-navigation-drawer
		v-model:rail="isRail"
		data-primary-drawer
		width="3.438rem"
		class="bg-black"
		permanent
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave">
		<v-list>
			<v-list-item
				prepend-avatar="/logo.svg"
				title="Toomas633's Dungeon"
				:subtitle="APP_VERSION"
				value="home"
				:active="false"
				to="/" />
		</v-list>
		<v-list
			v-model:selected="navSelection"
			color="primary"
			density="compact"
			nav>
			<v-list-item
				prepend-icon="mdi-toolbox"
				title="Projects"
				value="projects" />
			<v-list-item
				prepend-icon="mdi-controller"
				title="Game servers"
				value="servers" />
			<v-list-item
				prepend-icon="mdi-play-box-multiple"
				title="Demos"
				value="demos" />
			<v-list-item prepend-icon="mdi-archive" title="Archive" value="archive" />
			<v-list-item
				prepend-icon="mdi-card-account-mail"
				title="Contact"
				value="contact"
				to="/contact" />
			<v-list-item
				prepend-icon="mdi-hand-coin"
				title="Donate"
				value="donate"
				to="/donate" />
		</v-list>
		<template #append>
			<div v-if="fullyExpanded" class="text-center">
				<div class="d-flex justify-center mb-4">
					<v-tooltip :text="`Vue ${VUE_VERSION}`" location="right">
						<template #activator="{ props }">
							<v-img
								v-bind="props"
								:src="Vue"
								class="mx-1 vue"
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
								class="mx-1 vuetify"
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
								class="mx-1 nodejs"
								alt="Node.js icon"
								max-height="32"
								max-width="32" />
						</template>
					</v-tooltip>
				</div>
			</div>
			<v-list density="compact" nav>
				<v-list-item
					:title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
					:prepend-icon="
						isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
					"
					@click="changeTheme" />
			</v-list>
			<v-list
				v-if="fullyExpanded"
				v-model:selected="navSelection"
				color="primary"
				density="compact"
				nav>
				<v-list-item subtitle="Privacy Policy" value="privacy" to="/privacy" />
				<v-list-item subtitle="Terms of Service" value="tos" to="/tos" />
			</v-list>
			<div v-if="fullyExpanded" class="text-center mb-6">
				<v-btn
					icon="mdi-rocket-launch"
					href="https://thingiverse.com/toomas633"
					class="mx-2"
					color="blue"
					size="medium"
					variant="plain"
					aria-label="Thingiverse link" />
				<v-btn
					icon="mdi-twitter"
					href="https://x.com/Toomas633"
					class="mx-2"
					color="light-blue"
					size="medium"
					variant="plain"
					aria-label="Twitter link" />
				<v-btn
					icon="mdi-reddit"
					href="https://reddit.com/u/toomas633"
					class="mx-2"
					color="deep-orange"
					size="medium"
					variant="plain"
					aria-label="Reddit link" />
				<v-btn
					icon="mdi-github"
					href="https://github.com/Toomas633/"
					class="mx-2"
					color="grey"
					size="medium"
					variant="plain"
					aria-label="GitHub link" />
				<v-btn
					icon="mdi-email-edit"
					href="mailto:mailto:info@toomas633.com"
					color="red"
					class="mx-2"
					size="medium"
					variant="plain"
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
		class="bg-black"
		:scrim="false"
		touchless>
		<v-list
			v-model:selected="secondSelection"
			color="primary"
			density="compact"
			nav>
			<v-list-item
				v-for="item in drawerItems"
				:key="item.title"
				:value="item.href?.split('/')[2]"
				:to="!item.external ? item.href : undefined"
				:href="item.external ? item.href : undefined"
				:title="item.title"
				:subtitle="item.subtitle"
				:prepend-icon="item.icon"
				@click="handleSecondClick(item.href?.split('/')[2])" />
		</v-list>
	</v-navigation-drawer>
</template>
<script setup lang="ts">
import { APP_VERSION, VUE_VERSION, VUETIFY_VERSION } from '@/constants/env'
import router from '@/router'
import { MenuItem } from '@/types/menuItem'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Vue from '@/assets/icons/brands/vue.svg'
import Vuetify from '@/assets/icons/brands/vuetify.svg'
import NodeJS from '@/assets/icons/brands/nodejs.svg'
import useThemeMixin from '@/helpers/themeMixin'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import { projectRoutes } from '@/router/projects'
import { demoRoutes } from '@/router/demos'
import { RouteRecord } from '@/types/route'
import { archiveRoutes } from '@/router/archive'
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

	const expandableSections = ['projects', 'servers', 'demos', 'archive']

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
					external: true,
				},
			]
			break
		case 'archive':
			drawerItems.value = archiveRoutes.map((route) =>
				mapRouteToMenuItem(route)
			)
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
.vuetify:hover {
	filter: drop-shadow(0 0 0.5rem #1697f6);
}

.vue:hover {
	filter: drop-shadow(0 0 0.5rem #41b883);
}

.nodejs:hover {
	filter: drop-shadow(0 0 0.5rem #539e43);
}
</style>
