<template>
	<div
		class="unifi-switch rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="UniFi US-8-150W switch"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<!-- metal mounting ear -->
		<Box3D
			:w="14"
			:h="U - 4"
			:d="3"
			face-class="usw-ear-face"
			:style="pos(0, 2, 1)" />
		<!-- switch body -->
		<Box3D
			:w="SW_W"
			:h="U - 6"
			:d="140"
			face-class="usw-switch-face"
			:style="pos(14, 3, 1)">
			<template #front>
				<div class="switch-front">
					<div class="brand">
						<div class="ubnt-logo" />
						<span>UniFi Switch 8 POE-150W</span>
					</div>
					<div class="rj45-ports">
						<div v-for="port in 8" :key="port" class="rj45">
							<div class="rj45-led" />
						</div>
					</div>
					<div class="sfp-ports">
						<div v-for="port in 2" :key="port" class="sfp" />
					</div>
				</div>
			</template>
			<template #top><div class="switch-top" /></template>
		</Box3D>
		<!-- 3D printed mesh filler bar -->
		<Box3D
			:w="FACE_W - SW_W - 14"
			:h="U - 4"
			:d="6"
			face-class="usw-filler-face"
			:style="pos(SW_W + 14, 2, 1)">
			<template #front>
				<div class="mesh" />
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
	background: linear-gradient(180deg, #f4f4f5, #d4d5d8);
}

.brand {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: flex-start;
	width: 56px;

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

.rj45-ports {
	display: flex;
	gap: 2.5px;
}

.rj45 {
	position: relative;
	width: 10px;
	height: 12px;
	background: linear-gradient(180deg, #202024, #0b0b0d);
	border: 1px solid #8f9195;
	border-radius: 1px;
}

.rj45-led {
	position: absolute;
	top: 1px;
	right: 1px;
	width: 2px;
	height: 2px;
	background: #35d13c;
	border-radius: 50%;
	box-shadow: 0 0 2px #35d13c;
}

.sfp-ports {
	display: flex;
	gap: 2.5px;
	margin-left: 2px;
}

.sfp {
	width: 11px;
	height: 7px;
	background: linear-gradient(180deg, #17171a, #050506);
	border: 1px solid #8f9195;
	border-radius: 1px;
}

.switch-top {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, #fff, #e4e5e7);
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
