<template>
	<v-btn
		v-if="!drawer"
		data-contents-button
		class="toc-fab"
		color="black"
		icon="mdi-format-list-bulleted"
		elevation="8"
		position="fixed"
		@click="drawer = true" />
	<v-navigation-drawer
		v-model="drawer"
		data-contents-drawer
		location="right"
		temporary
		floating
		class="bg-black toc-drawer"
		:class="drawer ? 'open' : 'closed'"
		:scrim="false"
		touchless>
		<h2 class="text-center mt-1">Table of contents</h2>
		<v-list v-model:selected="selected" color="primary" density="compact" nav>
			<v-list-item
				v-for="heading in headings"
				:key="heading.id"
				:to="heading.hash"
				:value="heading.hash"
				:title="heading.title"
				:prepend-icon="heading.icon"
				:class="heading.level === 2 ? 'pl-8' : ''"
				:active="selected[0] === heading.hash"
				@click="close()" />
		</v-list>
	</v-navigation-drawer>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const selected = ref<string[]>([])
const ticking = ref(false)

type HeadingItem = {
	id: string
	title: string
	level: number
	hash: string
	icon: string
}

const route = useRoute()

const headings = computed<HeadingItem[]>(() => collectHeadings())

watch(
	() => route.hash,
	(newHash) => {
		selected.value = [newHash]
	},
	{ immediate: true }
)

onMounted(() => {
	getContainer().addEventListener('scroll', onScroll, { passive: true })
	getContainer().addEventListener('resize', onScroll, { passive: true })
	document.addEventListener('click', handleGlobalClick, { passive: true })
	document.addEventListener('touchstart', handleGlobalClick, { passive: true })
})

function collectHeadings(): HeadingItem[] {
	const container = getContainer()
	const nodes = Array.from(
		container.querySelectorAll<HTMLElement>('h1, h2')
	).filter(
		(el) => el.offsetParent !== null && !el.closest('.v-navigation-drawer')
	)

	const headings = nodes.map((el) => {
		const level = Number(el.tagName.substring(1)) || 6
		let id = el.id?.trim()
		const title = el.textContent.trim()
		return {
			id,
			title: title,
			level,
			hash: `#${id}`,
			icon: level < 2 ? 'mdi-format-title' : 'mdi-subdirectory-arrow-right',
		}
	})

	return headings.filter((h) => h.id)
}

function onScroll() {
	if (ticking.value) return
	ticking.value = true
	requestAnimationFrame(() => {
		updateActiveHeading()
		ticking.value = false
	})
}

function getContainer() {
	return document.querySelector('main, .v-main') as HTMLElement
}

function updateActiveHeading() {
	const container = getContainer()
	const containerRect = container.getBoundingClientRect()

	const items = Array.from(
		container.querySelectorAll<HTMLElement>('h1, h2')
	).filter(
		(el) => el.offsetParent !== null && !el.closest('.v-navigation-drawer')
	)

	if (!items || items.length === 0) return

	let closestHash = ''
	let closestDist = Number.POSITIVE_INFINITY

	for (const item of items) {
		const rect = item.getBoundingClientRect()
		const dist = Math.abs(rect.top - containerRect.top)
		if (dist < closestDist) {
			closestDist = dist
			closestHash = item.id ? `#${item.id}` : ''
		}
	}

	if (selected.value[0] !== closestHash) {
		selected.value = [closestHash]
	}
}

function handleGlobalClick(e: MouseEvent | TouchEvent) {
	const el = eventTargetElement(e)
	const insidePrimary = !!(el && el.closest('[data-contents-drawer]'))
	const insideSecondary = !!(el && el.closest('[data-contents-button]'))

	if (!insidePrimary && !insideSecondary) {
		drawer.value = false
	}
}

function eventTargetElement(e: MouseEvent | TouchEvent): Element | null {
	const t = (e.target as Node) ?? null
	if (!t) return null
	return t instanceof Element ? t : t.parentElement
}

function close() {
	drawer.value = false
}

onUnmounted(() => {
	getContainer().removeEventListener('scroll', onScroll)
	getContainer().removeEventListener('resize', onScroll)
	document.removeEventListener('click', handleGlobalClick)
	document.removeEventListener('touchstart', handleGlobalClick)
})
</script>
<style scoped lang="scss">
.toc-fab {
	right: calc(0.25rem + var(--scrollbar-offset));
	top: 5.15rem;
	transform: translateY(-50%);
}

.toc-drawer {
	&.open {
		right: var(--scrollbar-offset) !important;
	}

	&.closed {
		right: 0 !important;
	}
}
</style>
