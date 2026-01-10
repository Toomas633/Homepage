<template>
	<v-container>
		<v-row class="d-block d-md-flex" justify="center">
			<v-col class="align-content-space-around" md="12" lg="7">
				<h1 class="text-center">T6 Drone</h1>
				<StatsAndChips repo="toomas633/t6-drone" hide-langs />
				<p :class="!isMobile ? 'text-center' : ''">
					This is my first try at building a drone. It started as a schools
					practical work project for graduation. It is built around DJI F450
					frame. All the 3D files, including project files and printing files,
					are found on the
					<LinkComponent
						href="https://github.com/Toomas633/T6-Drone"
						text="GitHub page" />. 3D printing files in the STL form can be
					found on
					<LinkComponent
						href="https://www.thingiverse.com/thing:4804605"
						text="Thingiverse" />.
				</p>
			</v-col>
			<v-col
				class="align-content-space-around d-block d-md-flex pa-0 align-center">
				<v-row class="pa-0 ma-0" justify="center">
					<v-col>
						<ButtonCard
							text="Download ZIP"
							href="https://github.com/Toomas633/T6-Drone/archive/v2.zip"
							icon="mdi-file-download-outline" />
					</v-col>
					<v-col>
						<ButtonCard
							text="GitHub"
							href="https://github.com/Toomas633/T6-Drone"
							icon="mdi-github" />
					</v-col>
					<v-col>
						<ButtonCard
							text="Thingiverse"
							href="https://www.thingiverse.com/thing:4804605"
							icon="mdi-rocket-launch"
							icon-color="blue" />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<ImageCarousel class="my-4" :images="images" auto-scroll />
	</v-container>
</template>
<script setup lang="ts">
import render from '@/assets/images/t6-drone/render.webp'
import electronics from '@/assets/images/t6-drone/electronics.webp'
import model from '@/assets/images/t6-drone/model.webp'
import complete from '@/assets/images/t6-drone/complete.webp'
import type { Image } from '@/types/image'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const images: Image[] = [
	{
		src: render,
		title: 'KeyShot render',
		alt: 'KeyShot render',
	},
	{
		src: electronics,
		title: 'Electronics',
		alt: 'Electronics',
	},
	{
		src: model,
		title: 'SolidEdge model',
		alt: 'SolidEdge model',
	},
	{
		src: complete,
		title: 'Complete build',
		alt: 'Complete build',
	},
]
</script>
