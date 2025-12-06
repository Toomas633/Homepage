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
				<ArmV1 />
			</v-tabs-window-item>
			<v-tabs-window-item :value="Tabs.V2">
				<ArmV2 />
			</v-tabs-window-item>
		</v-tabs-window>
	</v-container>
</template>

<script setup lang="ts">
import { Tabs } from '@/enums/roboticArm'
import { ref } from 'vue'
import ArmV1 from './RoboticArm/ArmV1.vue'
import ArmV2 from './RoboticArm/ArmV2.vue'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const tab = ref<Tabs>(Tabs.V1)
const repo = 'toomas633/arduino-robotic-arm'
</script>
<style scoped lang="scss">
.v-slide-group {
	border-radius: 0.25rem;
}
</style>
