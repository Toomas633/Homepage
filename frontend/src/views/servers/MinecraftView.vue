<template>
	<v-tabs v-model="tab" align-tabs="center" grow stacked>
		<v-tab :value="Tabs.Status"> <v-icon icon="mdi-minecraft" /> Status </v-tab>
		<v-tab :value="Tabs.Statistics">
			<v-icon icon="mdi-poll" /> Statistics
		</v-tab>
		<v-tab :value="Tabs.Map"> <v-icon icon="mdi-map" /> Map </v-tab>
	</v-tabs>
	<v-tabs-window
		v-model="tab"
		class="w-100"
		style="height: calc(100vh - 4.5rem)"
		:style="backgroundImageStyle">
		<v-tabs-window-item :value="Tabs.Status" class="overflow-auto pa-4">
			<div :id="ANCHOR_ID_BY_TAB[Tabs.Status]" />
			<ServerStatus />
		</v-tabs-window-item>
		<v-tabs-window-item :value="Tabs.Statistics" class="h-100">
			<div :id="ANCHOR_ID_BY_TAB[Tabs.Statistics]" />
			<iframe
				title="Grafana"
				class="w-100 h-100 border-none"
				src="https://grafana.toomas633.com/public-dashboards/b6001832311f480fa0a153c29aadb839" />
		</v-tabs-window-item>
		<v-tabs-window-item :value="Tabs.Map" class="h-100">
			<div :id="ANCHOR_ID_BY_TAB[Tabs.Map]" />
			<iframe
				title="Map"
				class="w-100 h-100 border-none"
				src="https://map.toomas633.com"
				allowfullscreen />
		</v-tabs-window-item>
	</v-tabs-window>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs } from '@/enums/minecraft'
import background from '@/assets/images/minecraft/background.webp'
import ServerStatus from './Minecraft/ServerStatus.vue'

const tab = ref<Tabs>(Tabs.Status)

const route = useRoute()
const router = useRouter()

const HASH_BY_TAB: Record<Tabs, string> = {
	[Tabs.Status]: '#status',
	[Tabs.Statistics]: '#statistics',
	[Tabs.Map]: '#map',
}

const ANCHOR_ID_BY_TAB: Record<Tabs, string> = {
	[Tabs.Status]: 'status',
	[Tabs.Statistics]: 'statistics',
	[Tabs.Map]: 'map',
}

function parseTabFromHash(hash: string): Tabs | null {
	const normalized = decodeURIComponent(hash).trim().toLowerCase()
	if (normalized === '#status') return Tabs.Status
	if (normalized === '#statistics') return Tabs.Statistics
	if (normalized === '#map') return Tabs.Map
	return null
}

watch(
	() => route.hash,
	(newHash) => {
		const parsed = parseTabFromHash(newHash)
		if (parsed === null) {
			return
		}
		if (tab.value === parsed) {
			return
		}
		tab.value = parsed
	},
	{ immediate: true }
)

watch(tab, async (newTab) => {
	const desiredHash = HASH_BY_TAB[newTab]
	if (route.hash === desiredHash) return

	await nextTick()
	await router.replace({ hash: desiredHash })
})

const backgroundImageStyle = computed(() => {
	return {
		backgroundImage: `url(${background})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		marginBottom: '-48px',
	}
})
</script>
