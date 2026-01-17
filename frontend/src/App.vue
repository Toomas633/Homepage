<template>
	<v-app :style="rootStyle">
		<AppNavbar />
		<v-main ref="mainElement" class="pb-12">
			<router-view />
			<CookieConsent />
			<MessagePopup />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import useThemeMixin from './helpers/themeMixin'
import { VMain } from 'vuetify/components'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const mainElement = ref<InstanceType<typeof VMain>>()
const hasScrollbar = ref(false)

const { checkThemeStorage } = useThemeMixin()

const SCROLLBAR_OFFSET = {
	MOBILE: '0.25rem',
	DESKTOP: '1rem',
	NONE: '0rem',
} as const

const rootStyle = computed(() => ({
	'--scrollbar-offset': getScrollbarOffset(),
}))

onMounted(() => {
	checkThemeStorage()
	setTimeout(() => {
		checkScrollbar()
	}, 100)
	window.addEventListener('load', checkScrollbar)
	window.addEventListener('resize', checkScrollbar)
	window.addEventListener('scroll', checkScrollbar, { passive: true })
	const observer = new MutationObserver(checkScrollbar)
	observer.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
	window.removeEventListener('load', checkScrollbar)
	window.removeEventListener('resize', checkScrollbar)
	window.removeEventListener('scroll', checkScrollbar)
})

function getScrollbarOffset() {
	if (!hasScrollbar.value) return SCROLLBAR_OFFSET.NONE
	return isMobile ? SCROLLBAR_OFFSET.MOBILE : SCROLLBAR_OFFSET.DESKTOP
}

function checkScrollbar() {
	hasScrollbar.value =
		mainElement.value?.$el.scrollHeight > mainElement.value?.$el.clientHeight
}
</script>
