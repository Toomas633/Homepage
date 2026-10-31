<template>
	<div
		class="rack-frame rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="VEVOR 15U open frame server rack"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<!-- 4 vertical posts -->
		<Box3D
			v-for="post in posts"
			:key="post.key"
			:w="POST_W"
			:h="postH"
			:d="POST_D"
			face-class="frame-steel-face"
			:style="post.style">
			<template v-if="post.key === 'front-left'" #front>
				<div class="rail-holes" />
				<div class="u-marks" />
				<div class="unit-numbers">
					<span v-for="n in RACK_UNITS" :key="n">{{ RACK_UNITS - n + 1 }}</span>
				</div>
				<div class="vevor-label">VEVOR</div>
			</template>
			<template v-else-if="post.key === 'front-right'" #front>
				<div class="rail-holes" />
				<div class="u-marks" />
			</template>
		</Box3D>
		<!-- top and bottom side beams -->
		<Box3D
			v-for="beam in beams"
			:key="beam.key"
			:w="POST_W"
			:h="FRAME_H"
			:d="RACK_D + POST_D"
			face-class="frame-steel-face"
			:style="beam.style" />
		<!-- casters -->
		<div
			v-for="caster in casters"
			:key="caster.key"
			class="caster"
			:style="caster.style">
			<div class="caster-plate" />
			<div class="caster-disc caster-disc-left" />
			<div class="caster-disc caster-disc-right" />
			<div class="caster-tread" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Box3D from './Box3D.vue'
import {
	FACE_W,
	POST_W,
	POST_D,
	RACK_D,
	RAILS_H,
	FRAME_H,
	RACK_UNITS,
} from './rack3d'

defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const postH = RAILS_H + 2 * FRAME_H
const postXRight = FACE_W - POST_W

const posts = computed(() => [
	{
		key: 'front-left',
		style: pos(0, -FRAME_H, 0),
	},
	{
		key: 'front-right',
		style: pos(postXRight, -FRAME_H, 0),
	},
	{
		key: 'rear-left',
		style: pos(0, -FRAME_H, -RACK_D),
	},
	{
		key: 'rear-right',
		style: pos(postXRight, -FRAME_H, -RACK_D),
	},
])

const beams = computed(() => [
	{ key: 'top-left', style: pos(0, -FRAME_H, 0) },
	{ key: 'top-right', style: pos(postXRight, -FRAME_H, 0) },
	{ key: 'bottom-left', style: pos(0, RAILS_H, 0) },
	{ key: 'bottom-right', style: pos(postXRight, RAILS_H, 0) },
])

const casters = computed(() => {
	const y = RAILS_H + FRAME_H
	return [
		{ key: 'fl', style: pos(2, y, -4) },
		{ key: 'fr', style: pos(postXRight + 2, y, -4) },
		{ key: 'rl', style: pos(2, y, -RACK_D - 4) },
		{ key: 'rr', style: pos(postXRight + 2, y, -RACK_D - 4) },
	]
})

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.rail-holes {
	position: absolute;
	inset: 0;
	background-image: radial-gradient(
		circle at 50% 5px,
		rgb(0 0 0 / 95%) 0 2.4px,
		rgb(150 150 158 / 80%) 3px,
		transparent 3.6px
	);
	background-size: 10px 10px;
	background-position: 0 20px;
}

.u-marks {
	position: absolute;
	inset: 0;
	background-image: linear-gradient(
		180deg,
		rgb(255 255 255 / 14%) 0 1px,
		transparent 1px
	);
	background-size: 100% 30px;
	background-position: 0 20px;
}

.vevor-label {
	position: absolute;
	top: 4px;
	left: 50%;
	font-size: 4.5px;
	font-weight: 800;
	letter-spacing: 0.3px;
	color: #f5a623;
	transform: translateX(-50%);
}

.unit-numbers {
	position: absolute;
	top: 20px;
	left: 1px;
	display: flex;
	flex-direction: column;

	span {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 30px;
		font-size: 9px;
		font-weight: 600;
		line-height: 1;
		color: #b7b7bd;
	}
}

.caster {
	position: absolute;
	top: 0;
	left: 0;
	width: 20px;
	transform-style: preserve-3d;
}

.caster-plate {
	position: absolute;
	width: 20px;
	height: 16px;
	background: linear-gradient(180deg, #45454a, #27272b);
	transform: rotateX(90deg);
	transform-origin: 0 0;
	backface-visibility: hidden;
}

.caster-disc {
	position: absolute;
	width: 28px;
	height: 28px;
	background: radial-gradient(circle at 50% 50%, #5a5a60 0 32%, #232327 70%);
	border: 1px solid #4a4a50;
	border-radius: 50%;
	transform-origin: 0 0;
	backface-visibility: hidden;
}

.caster-disc-left {
	transform: translate3d(4px, 5px, 6px) rotateY(-90deg) translateX(-28px);
}

.caster-disc-right {
	transform: translate3d(16px, 5px, 6px) rotateY(90deg);
}

.caster-tread {
	position: absolute;
	width: 12px;
	height: 29px;
	background: linear-gradient(180deg, #2a2a2e 0%, #0e0e10 55%, #1c1c1f 100%);
	border-radius: 45% 45% 50% 50%;
	transform: translate3d(4px, 5px, -8px);
	transform-origin: 0 0;
}
</style>
<style lang="scss">
@use './device' as *;

.frame-steel-face {
	@include steel(#3e3e44, #242428);
}

/* edge bevel so the posts separate from the backdrop */
.frame-steel-face.face-front {
	box-shadow:
		inset 1.5px 0 0 rgb(255 255 255 / 22%),
		inset -1.5px 0 0 rgb(0 0 0 / 45%);
}

.frame-steel-face.face-left,
.frame-steel-face.face-right {
	box-shadow: inset 0 0 0 1px rgb(0 0 0 / 35%);
}
</style>
