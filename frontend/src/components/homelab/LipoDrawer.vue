<template>
	<div
		class="lipo-drawer rack-device"
		:class="{ selected, open: selected }"
		role="button"
		tabindex="0"
		aria-label="LiPo charging drawer"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<!-- static drawer slides -->
		<Box3D
			v-for="rail in rails"
			:key="rail.key"
			:w="3"
			:h="10"
			:d="TRAY_D"
			face-class="drawer-slide-face"
			:style="rail.style" />
		<div class="drawer">
			<!-- tray with open top -->
			<Box3D
				:w="TRAY_W"
				:h="TRAY_H"
				:d="TRAY_D"
				face-class="drawer-tray-face"
				hide-top
				:style="pos(TRAY_X, 6, -2)">
				<template #bottom>
					<div class="tray-floor" />
				</template>
			</Box3D>
			<!-- iMAX B6 charger -->
			<Box3D
				:w="62"
				:h="16"
				:d="58"
				face-class="drawer-b6-face"
				:style="pos(TRAY_X + 14, TRAY_H - 12, -36)">
				<template #top>
					<div class="b6-top">
						<div class="b6-lcd">IMAX B6</div>
						<div class="b6-buttons">
							<div v-for="btn in 4" :key="btn" class="b6-btn" />
						</div>
					</div>
				</template>
			</Box3D>
			<!-- 2x 4S LiPo packs -->
			<Box3D
				v-for="(lipo, i) in lipos"
				:key="i"
				:w="44"
				:h="16"
				:d="92"
				face-class="drawer-lipo-face"
				:style="lipo.style">
				<template #top>
					<div class="lipo-top">
						<span>4S 14.8V</span>
						<div class="lipo-leads" />
					</div>
				</template>
			</Box3D>
			<!-- front panel with handle -->
			<Box3D
				:w="FACE_W"
				:h="U - 2"
				:d="4"
				face-class="drawer-front-face"
				:style="pos(0, 1, 2)">
				<template #front>
					<div class="drawer-front">
						<div class="thumb-screw" />
						<div class="handle" />
						<div class="thumb-screw" />
					</div>
				</template>
			</Box3D>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Box3D from './Box3D.vue'
import { FACE_W, U } from './rack3d'

defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const TRAY_X = 24
const TRAY_W = FACE_W - 2 * TRAY_X
const TRAY_H = U - 8
const TRAY_D = 250

const rails = computed(() => [
	{ key: 'left', style: pos(TRAY_X - 4, 10, -4) },
	{ key: 'right', style: pos(TRAY_X + TRAY_W + 1, 10, -4) },
])

const lipos = computed(() => [
	{ style: pos(TRAY_X + 108, TRAY_H - 12, -24) },
	{ style: pos(TRAY_X + 160, TRAY_H - 12, -24) },
])

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.drawer {
	position: absolute;
	transform-style: preserve-3d;
	transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.3, 1);
}

.open .drawer {
	transform: translateZ(150px);
}

.tray-floor {
	position: absolute;
	inset: 0;
	background:
		radial-gradient(circle, rgb(255 255 255 / 4%) 0 0.7px, transparent 1px) 0
			0 / 6px 6px,
		linear-gradient(180deg, #232327, #19191c);
}

.b6-top {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: 3px;
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #2b63b8, #1b4585);
}

.b6-lcd {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70%;
	height: 40%;
	font-size: 5px;
	color: #16381c;
	background: linear-gradient(180deg, #9fd4a4, #7fba86);
	border: 1px solid #10294d;
	border-radius: 1px;
}

.b6-buttons {
	display: flex;
	gap: 4px;
}

.b6-btn {
	width: 6px;
	height: 6px;
	background: radial-gradient(circle, #1a1a1d 0 60%, #000 100%);
	border-radius: 50%;
}

.lipo-top {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #1e4fd0, #14348a);

	span {
		font-size: 5px;
		font-weight: 700;
		color: #e8ecf5;
	}
}

.lipo-leads {
	position: relative;
	width: 60%;
	height: 3px;
	background: linear-gradient(
		90deg,
		#d32f2f 0 30%,
		transparent 30% 70%,
		#111 70%
	);
	border-radius: 2px;

	&::after {
		position: absolute;
		top: -1px;
		left: 50%;
		width: 6px;
		height: 5px;
		content: '';
		background: #f9c825;
		border-radius: 1px;
		transform: translateX(-50%);
	}
}

.drawer-front {
	position: absolute;
	inset: 0;
	display: flex;
	gap: 10px;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	background:
		repeating-linear-gradient(
			90deg,
			rgb(255 255 255 / 2%) 0 1px,
			transparent 1px 3px
		),
		linear-gradient(180deg, #2d2d32 0%, #222227 55%, #19191d 100%);
}

.handle {
	position: relative;
	flex: 0 0 120px;
	height: 8px;
	background: linear-gradient(180deg, #75777c 0%, #5a5c61 45%, #404247 100%);
	border-radius: 4px;
	box-shadow:
		0 3px 4px rgb(0 0 0 / 60%),
		inset 0 1px 0 rgb(255 255 255 / 30%);

	&::before,
	&::after {
		position: absolute;
		top: 6px;
		width: 6px;
		height: 6px;
		content: '';
		background: linear-gradient(180deg, #4a4c51, #2e3034);
		border-radius: 0 0 2px 2px;
	}

	&::before {
		left: 6px;
	}

	&::after {
		right: 6px;
	}
}

.thumb-screw {
	width: 8px;
	height: 8px;
	background: radial-gradient(circle at 38% 32%, #8d8f94 0 35%, #46484d 100%);
	border-radius: 50%;
	box-shadow:
		0 1px 2px rgb(0 0 0 / 55%),
		inset 0 -1px 1px rgb(0 0 0 / 40%);
}
</style>
<style lang="scss">
@use './device' as *;

.drawer-slide-face {
	background: linear-gradient(180deg, #8b8d92, #5d5f64);
}

.drawer-tray-face {
	@include steel(#2c2c30, #1c1c1f);
}

.drawer-front-face {
	@include steel(#2e2e33, #1d1d21);
}

.drawer-b6-face {
	background: linear-gradient(180deg, #2458a5, #16386b);
}

.drawer-lipo-face {
	background: linear-gradient(180deg, #17171a, #0b0b0d);
}
</style>
