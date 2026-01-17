<template>
	<v-container>
		<h1 class="text-center">Robotic Arm</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p class="mb-2" :class="!isMobile ? 'text-center' : ''">
			This is Arduino Uno robotic arm using joystick input. It's my first
			Arduino project that I have coded completely by myself from the beginning.
			The arm needs some spare metal or weight in the base for extra heft so it
			won't tip over so easily. It's using servos with metal gearboxes for extra
			sturdiness and better power and performance. Currently on my setup it can
			lift about 1kg of weights.
		</p>
		<StatsAndChips hide-chips :repo="repo" />
		<v-tabs v-model="tab" align-tabs="center" class="elevation-4" grow stacked>
			<v-tab :value="Tabs.V1">
				<v-icon icon="mdi-robot-industrial" /> V1
			</v-tab>
			<v-tab :value="Tabs.V2">
				<v-icon icon="mdi-robot-industrial" /> V2
			</v-tab>
		</v-tabs>
		<v-tabs-window v-model="tab" class="v-tabs-wrapper">
			<v-tabs-window-item :value="Tabs.V1">
				<div :id="ANCHOR_ID_BY_TAB[Tabs.V1]" />
				<ArmV1 />
			</v-tabs-window-item>
			<v-tabs-window-item :value="Tabs.V2">
				<div :id="ANCHOR_ID_BY_TAB[Tabs.V2]" />
				<ArmV2 />
			</v-tabs-window-item>
		</v-tabs-window>
	</v-container>
</template>
<script setup lang="ts">
import { Tabs } from '@/enums/roboticArm'
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArmV1 from './RoboticArm/ArmV1.vue'
import ArmV2 from './RoboticArm/ArmV2.vue'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const tab = ref<Tabs>(Tabs.V1)
const repo = 'toomas633/arduino-robotic-arm'

const route = useRoute()
const router = useRouter()

const HASH_BY_TAB: Record<Tabs, string> = {
	[Tabs.V1]: '#v1',
	[Tabs.V2]: '#v2',
}

const ANCHOR_ID_BY_TAB: Record<Tabs, string> = {
	[Tabs.V1]: 'v1',
	[Tabs.V2]: 'v2',
}

function parseTabFromHash(hash: string): Tabs | null {
	const normalized = decodeURIComponent(hash).trim().toLowerCase()
	if (normalized === '#v1') return Tabs.V1
	if (normalized === '#v2') return Tabs.V2
	return null
}

watch(
	() => route.hash,
	(newHash) => {
		const parsed = parseTabFromHash(newHash)
		if (parsed === null || tab.value === parsed) return
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
</script>
<style scoped lang="scss">
.v-slide-group {
	border-radius: 0.25rem;
}
</style>
