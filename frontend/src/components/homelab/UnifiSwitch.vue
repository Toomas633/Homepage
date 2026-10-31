<template>
	<div
		class="unifi-switch rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="UniFi US-8-150W switch"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<!-- 3D printed mesh filler bar on the left -->
		<Box3D
			:w="FACE_W - SW_W - EAR_W"
			:h="U - 4"
			:d="6"
			face-class="usw-filler-face"
			:style="pos(0, 2, 1)">
			<template #front>
				<div class="mesh" />
			</template>
		</Box3D>
		<!-- switch body -->
		<Box3D
			:w="SW_W"
			:h="U - 6"
			:d="140"
			face-class="usw-switch-face"
			:style="pos(FACE_W - SW_W - EAR_W, 3, 1)">
			<template #front>
				<div class="switch-front">
					<div class="brand">
						<div class="ubnt-logo" />
						<span>UniFi Switch 8 POE-150W</span>
					</div>
					<div class="port-block">
						<div class="port-leds">
							<div v-for="port in 8" :key="port" class="port-led" />
						</div>
						<div class="rj45-ports">
							<div v-for="port in 8" :key="port" class="rj45">
								<div class="rj45-tab" />
							</div>
						</div>
						<div class="port-labels">
							<span v-for="port in 8" :key="port">{{ port }}</span>
						</div>
					</div>
					<div class="sfp-block">
						<div class="sfp-ports">
							<div v-for="port in 2" :key="port" class="sfp" />
						</div>
						<div class="port-labels sfp-labels">
							<span>9</span>
							<span>10</span>
						</div>
					</div>
				</div>
			</template>
			<template #top>
				<div class="switch-top">
					<div class="top-logo" />
				</div>
			</template>
		</Box3D>
		<!-- original metal mounting ear -->
		<Box3D
			:w="EAR_W"
			:h="U - 4"
			:d="3"
			face-class="usw-ear-face"
			:style="pos(FACE_W - EAR_W, 2, 1)">
			<template #front>
				<div class="ear-front">
					<div class="ear-hole" />
					<div class="ear-hole" />
				</div>
			</template>
		</Box3D>
	</div>
</template>
<script setup lang="ts">
import Box3D from './Box3D.vue'
import { FACE_W, U } from './rack3d'

defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const SW_W = 186
const EAR_W = 14

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.switch-front {
	position: absolute;
	inset: 0;
	display: flex;
	gap: 6px;
	align-items: center;
	padding: 0 8px;
	background: linear-gradient(180deg, #f8f8f9 0%, #ececee 55%, #d7d8db 100%);
	border-bottom: 1px solid #b9babd;
}

.brand {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: flex-start;
	width: 52px;

	span {
		font-size: 3.5px;
		line-height: 1.2;
		color: #6e7074;
	}
}

.ubnt-logo {
	width: 8px;
	height: 8px;
	background: radial-gradient(circle, #06a7e2 0 58%, transparent 60%);
	border-radius: 50%;
}

.port-block,
.sfp-block {
	display: flex;
	flex-direction: column;
	gap: 1px;
	align-items: center;
}

.port-leds {
	display: flex;
	gap: 8px;
}

.port-led {
	width: 2.5px;
	height: 2.5px;
	background: #35d13c;
	border-radius: 50%;
	box-shadow: 0 0 2px #35d13c;
}

.rj45-ports {
	display: flex;
	gap: 2.5px;
}

.rj45 {
	position: relative;
	width: 10px;
	height: 10px;
	background: linear-gradient(180deg, #202024, #0b0b0d);
	border: 1px solid #9ea0a4;
	border-radius: 1px;
}

.rj45-tab {
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 4px;
	height: 2.5px;
	background: #050506;
	border: 1px solid #38383d;
	border-bottom: 0;
	transform: translateX(-50%);
}

.port-labels {
	display: flex;
	gap: 7.5px;

	span {
		width: 5px;
		font-size: 3px;
		color: #87898d;
		text-align: center;
	}
}

.sfp-ports {
	display: flex;
	gap: 2.5px;
	margin-top: 3.5px;
}

.sfp {
	width: 11px;
	height: 6px;
	background:
		linear-gradient(90deg, rgb(255 255 255 / 14%) 0 1px, transparent 1px 10px),
		linear-gradient(180deg, #2e2f33, #101013);
	border: 1px solid #b4b6ba;
	border-radius: 1px;
}

.sfp-labels {
	gap: 8px;
}

.switch-top {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, #fff, #e8e9eb);
}

.top-logo {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 16px;
	height: 16px;
	background: radial-gradient(
		circle,
		#06a7e2 0 36%,
		#e8e9eb 40% 58%,
		#06a7e2 62% 78%,
		transparent 80%
	);
	border-radius: 50%;
	box-shadow: 0 0 6px rgb(6 167 226 / 55%);
	transform: translate(-50%, -50%);
}

.ear-front {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
	justify-content: center;
}

.ear-hole {
	width: 5px;
	height: 5px;
	background: radial-gradient(circle, #0a0a0c 0 45%, #55565b 60% 100%);
	border-radius: 50%;
}

.mesh {
	position: absolute;
	inset: 2px;

	@include vent-mesh(rgb(0 0 0 / 95%), #232327, 5px);

	border-radius: 2px;
}
</style>
<style lang="scss">
@use './device' as *;

.usw-ear-face {
	@include steel(#44444a, #2a2a2e);
}

.usw-switch-face {
	background: linear-gradient(180deg, #fdfdfd, #d8d9db);
}

.usw-filler-face {
	background: #141416;
}
</style>
