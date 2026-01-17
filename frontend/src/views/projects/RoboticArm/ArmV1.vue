<template>
	<v-row justify="center" class="d-block d-sm-flex">
		<v-col md="6" lg="5" class="pb-0" style="max-height: 26.75rem">
			<ImageCarousel class="mt-3" :images="images" />
		</v-col>
		<v-col class="pl-0">
			<h1 class="text-center mt-4">V1</h1>
			<p :class="!isMobile ? 'text-center' : 'ml-4'">
				I recently salvaged a broken controller for joysticks and decided to
				take a crack at a robotic arm. Joysticks change the servo position
				values so they hold position and won't come back when you let go.
				Buttons are programmed to use the Arduino's built in pullup resistors,
				so none are needed on the ground nor on the signal lines. Serial monitor
				can show real time feedback on button values and servo positions.
			</p>
			<v-row justify="center" class="mt-4 d-block d-sm-flex">
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="Download"
						href="https://github.com/Toomas633/Arduino-Robotic-Arm/releases/download/v1/Robotic-Arm-v1.ino"
						icon="mdi-file-download-outline" />
				</v-col>
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="GitHub"
						href="https://github.com/Toomas633/Arduino-Robotic-Arm/tree/v1"
						icon="mdi-github" />
				</v-col>
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="Thingiverse"
						href="https://www.thingiverse.com/thing:5391135"
						icon="mdi-rocket-launch"
						icon-color="blue" />
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
import arm from '@/assets/images/robotic-arm/arm.webp'
import list from '@/assets/images/robotic-arm/v1/list.webp'
import wiring from '@/assets/images/robotic-arm/v1/wiring.webp'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const images = [
	{
		src: arm,
		alt: 'Arm V1',
		title: 'Robotic Arm V1',
	},
	{
		src: wiring,
		alt: 'Wiring',
		title: 'Wiring Diagram',
	},
	{
		src: list,
		alt: 'List',
		title: 'Parts List',
	},
]
</script>
