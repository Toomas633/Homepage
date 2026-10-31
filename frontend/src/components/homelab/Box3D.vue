<template>
	<div class="box3d" :style="rootStyle">
		<div class="face face-front" :class="faceClass" :style="frontStyle">
			<slot name="front" />
		</div>
		<div class="face face-back" :class="faceClass" :style="backStyle">
			<slot name="back" />
		</div>
		<div class="face face-left" :class="faceClass" :style="leftStyle">
			<slot name="left" />
		</div>
		<div class="face face-right" :class="faceClass" :style="rightStyle">
			<slot name="right" />
		</div>
		<div
			v-if="!hideTop"
			class="face face-top"
			:class="faceClass"
			:style="topStyle">
			<slot name="top" />
		</div>
		<div class="face face-bottom" :class="faceClass" :style="bottomStyle">
			<slot name="bottom" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	/** Box width in px (x axis) */
	w: number
	/** Box height in px (y axis) */
	h: number
	/** Box depth in px (z axis, extends backwards from the front face) */
	d: number
	/** Extra class applied to every face */
	faceClass?: string
	/** Skip rendering the top face (e.g. lid removed) */
	hideTop?: boolean
}>()

const rootStyle = computed(() => ({
	width: `${props.w}px`,
	height: `${props.h}px`,
}))
const frontStyle = computed(() => ({
	width: `${props.w}px`,
	height: `${props.h}px`,
}))
const backStyle = computed(() => ({
	width: `${props.w}px`,
	height: `${props.h}px`,
	transform: `translateZ(${-props.d}px) translateX(${props.w}px) rotateY(180deg)`,
}))
const leftStyle = computed(() => ({
	width: `${props.d}px`,
	height: `${props.h}px`,
	transform: `rotateY(-90deg) translateX(${-props.d}px)`,
}))
const rightStyle = computed(() => ({
	width: `${props.d}px`,
	height: `${props.h}px`,
	transform: `translateX(${props.w}px) rotateY(90deg)`,
}))
const topStyle = computed(() => ({
	width: `${props.w}px`,
	height: `${props.d}px`,
	transform: `rotateX(90deg) translateY(${-props.d}px)`,
}))
const bottomStyle = computed(() => ({
	width: `${props.w}px`,
	height: `${props.d}px`,
	transform: `translateY(${props.h}px) rotateX(-90deg)`,
}))
</script>
<style scoped lang="scss">
.box3d {
	position: absolute;
	top: 0;
	left: 0;
	transform-style: preserve-3d;
	pointer-events: none;
}

.face {
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: 0 0;
	backface-visibility: hidden;
	overflow: hidden;
	pointer-events: auto;

	/* simulated directional light (from the front-top-right) */
	&::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		content: '';
		pointer-events: none;
	}

	/* fine surface grain so materials don't read as flat vector fills */
	&::after {
		position: absolute;
		inset: 0;
		z-index: 2;
		content: '';
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
		opacity: 0.045;
		pointer-events: none;
	}
}

.face-front::before {
	background:
		linear-gradient(180deg, rgb(0 0 0 / 30%) 0, transparent 3px),
		linear-gradient(0deg, rgb(0 0 0 / 24%) 0, transparent 3px),
		linear-gradient(
			180deg,
			rgb(255 255 255 / 7%) 0%,
			rgb(255 255 255 / 3%) 30%,
			transparent 55%,
			rgb(0 0 0 / 8%) 100%
		);
}

.face-back::before {
	background: rgb(0 0 0 / 35%);
}

.face-left::before {
	background: linear-gradient(180deg, rgb(0 0 0 / 16%), rgb(0 0 0 / 26%));
}

.face-right::before {
	background: linear-gradient(
		180deg,
		rgb(255 255 255 / 10%),
		rgb(255 255 255 / 4%)
	);
}

.face-top::before {
	background: rgb(255 255 255 / 9%);
}

.face-bottom::before {
	background: rgb(0 0 0 / 30%);
}
</style>
