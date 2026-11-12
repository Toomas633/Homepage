<template>
	<v-btn
		v-if="!drawer"
		data-contents-button
		class="toc-fab"
		icon="mdi-format-list-bulleted"
		variant="flat"
		elevation="0"
		aria-label="Open table of contents"
		position="fixed"
		@click="drawer = true" />
	<v-navigation-drawer
		v-model="drawer"
		data-contents-drawer
		location="right"
		temporary
		floating
		width="288"
		class="toc-drawer"
		:class="drawer ? 'open' : 'closed'"
		:scrim="false"
		touchless>
		<div class="toc-head">
			<v-icon icon="mdi-format-list-bulleted" size="18" class="toc-head-icon" />
			<span class="toc-head-label">On this page</span>
			<v-btn
				class="toc-close"
				icon="mdi-close"
				variant="text"
				size="small"
				aria-label="Close table of contents"
				@click="close()" />
		</div>
		<v-list v-model:selected="selected" class="toc-list" density="compact" nav>
			<v-list-item
				v-for="heading in headings"
				:key="heading.id"
				:to="heading.hash"
				:value="heading.hash"
				class="toc-item"
				:class="{
					'toc-item-sub': heading.level === 2,
					'toc-item-active': selected[0] === heading.hash,
				}"
				:active="selected[0] === heading.hash"
				@click="close()">
				<span class="toc-item-text">{{ heading.title }}</span>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const selected = ref<string[]>([])
const ticking = ref(false)
const lastUrlHash = ref('')

type HeadingItem = {
	id: string
	title: string
	level: number
	hash: string
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
	lastUrlHash.value = globalThis.location.hash
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
		replaceUrlHashSilently(closestHash)
	}
}

function replaceUrlHashSilently(hash: string) {
	if (!hash) return

	const normalized = decodeURIComponent(hash).trim().toLowerCase()
	if (normalized === decodeURIComponent(lastUrlHash.value).trim().toLowerCase())
		return

	const url = new URL(globalThis.location.href)
	url.hash = hash
	globalThis.history.replaceState(globalThis.history.state, '', url.toString())
	lastUrlHash.value = hash
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
/* --------------------------------------------------------------------------
   Floating trigger
   -------------------------------------------------------------------------- */

.v-btn.toc-fab {
	right: calc(0.5rem + var(--scrollbar-offset));
	top: 5.15rem;
	transform: translateY(-50%);
	background-color: rgb(var(--v-theme-surface-bright));
	color: rgb(var(--v-theme-primary));
	border: 0.0625rem solid rgba(var(--v-theme-primary), 0.3);
	border-radius: var(--radius-md);
	backdrop-filter: blur(0.75rem);
	box-shadow: var(--shadow-md);
	transition:
		background-color var(--speed-base) var(--ease-out),
		box-shadow var(--speed-base) var(--ease-out),
		border-color var(--speed-base) var(--ease-out);
}

/* Keep the floating button perfectly still so it never dodges the cursor. */
.v-btn.toc-fab:hover,
.v-btn.toc-fab:active {
	translate: none;
	transform: translateY(-50%);
	background-color: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-on-primary));
	border-color: transparent;
	box-shadow: var(--shadow-glow);
}

/* --------------------------------------------------------------------------
   Drawer shell
   -------------------------------------------------------------------------- */

.toc-drawer {
	--toc-surface: rgba(var(--v-theme-surface), 0.92);

	background-color: var(--toc-surface) !important;
	backdrop-filter: blur(1rem);
	border-left: 0.0625rem solid var(--surface-line) !important;
	box-shadow: var(--shadow-lg);

	&.open {
		right: var(--scrollbar-offset) !important;
	}

	&.closed {
		right: 0 !important;
	}
}

.toc-head {
	position: sticky;
	top: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 0.5rem 0.875rem 1rem;
	background-color: var(--toc-surface);
	backdrop-filter: blur(1rem);
	border-bottom: 0.0625rem solid var(--surface-line);
}

.toc-head-icon {
	color: rgb(var(--v-theme-primary));
}

.toc-head-label {
	flex: 1 1 auto;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	opacity: 0.72;
}

.toc-close {
	opacity: 0.6;
	transition: opacity var(--speed-fast) var(--ease-out);
}

.toc-close:hover {
	opacity: 1;
}

/* --------------------------------------------------------------------------
   Heading list
   -------------------------------------------------------------------------- */

.toc-list {
	background: transparent !important;
	padding: 0.5rem 0.5rem 1rem;
}

.toc-item {
	position: relative;
	min-height: 2.25rem;
	padding-inline-start: 1rem !important;
	border-radius: var(--radius-md);
	transition:
		background-color var(--speed-fast) var(--ease-out),
		color var(--speed-fast) var(--ease-out);
}

.toc-item::before {
	content: '';
	position: absolute;
	inset-block: 0.375rem;
	inset-inline-start: 0.375rem;
	width: 0.125rem;
	border-radius: var(--radius-pill);
	background-color: currentcolor;
	opacity: 0.2;
	transition:
		opacity var(--speed-fast) var(--ease-out),
		background-color var(--speed-fast) var(--ease-out);
}

.toc-item-text {
	display: block;
	font-size: 0.875rem;
	line-height: 1.35;
	opacity: 0.78;
	transition: opacity var(--speed-fast) var(--ease-out);
}

.toc-item:hover {
	background-color: rgba(var(--v-theme-primary), 0.08);
}

.toc-item:hover .toc-item-text {
	opacity: 1;
}

.v-list-item.toc-item-active {
	color: rgb(var(--v-theme-primary));
	background-color: rgba(var(--v-theme-primary), 0.12);
}

.toc-item-active::before {
	opacity: 1;
	background-color: rgb(var(--v-theme-primary));
}

.toc-item-active .toc-item-text {
	font-weight: 700;
	opacity: 1;
}

.toc-item-sub {
	padding-inline-start: 1.875rem !important;
}

.toc-item-sub::before {
	inset-inline-start: 1.25rem;
}

.toc-item-sub .toc-item-text {
	font-size: 0.8125rem;
	opacity: 0.62;
}

/* Vuetify paints its own state layer over list items; the styling above
   already conveys hover/active, so the built-in overlay is suppressed. */
/* stylelint-disable selector-class-pattern */
.toc-item :deep(.v-list-item__overlay) {
	opacity: 0 !important;
}
/* stylelint-enable selector-class-pattern */
</style>
