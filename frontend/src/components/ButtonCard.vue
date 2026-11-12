<template>
	<v-card
		class="button-card text-center d-flex flex-column align-center justify-center pa-4"
		:class="href ? 'lift cursor-pointer' : ''"
		elevation="0"
		@click="navigate">
		<h1 v-if="title" class="button-card-title mb-2">
			{{ title }}
		</h1>
		<div
			v-if="href && icon"
			class="button-card-icon d-flex align-center justify-center mb-3"
			:style="{ width: `${size}px`, height: `${size}px` }">
			<v-btn
				icon
				:height="size"
				:width="size"
				class="pa-0"
				variant="text"
				elevation="0"
				:aria-label="label ?? text ?? title">
				<v-icon :icon="icon" :color="iconColor" :size="iconSize" />
			</v-btn>
		</div>
		<v-img
			v-if="image"
			:src="isDark && imageDark ? imageDark : image"
			class="button-card-image mb-3"
			rounded="lg"
			:height="imageSize" />
		<v-card-text v-if="text" class="button-card-text pa-0">
			{{ text }}
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useThemeMixin from '@/helpers/themeMixin'

const props = withDefaults(
	defineProps<{
		label?: string
		title?: string
		href?: string
		icon?: string
		iconColor?: string
		text?: string
		image?: string
		imageDark?: string
		imageSize?: string
		size?: string
	}>(),
	{
		size: '100',
		imageSize: '100',
	}
)

const { isDark } = useThemeMixin()

const iconSize = computed(() => `${Math.round(Number(props.size) * 0.62)}`)

function navigate() {
	if (props.href) {
		window.open(props.href, '_blank', 'noopener,noreferrer')
	}
}
</script>

<style scoped lang="scss">
.button-card {
	position: relative;
	height: 100%;
	overflow: hidden;
	background-color: rgb(var(--v-theme-surface));
}

.button-card::after {
	content: '';
	position: absolute;
	inset: 0;
	pointer-events: none;
	opacity: 0;
	background: radial-gradient(
		12rem 8rem at 50% 0%,
		rgba(var(--v-theme-primary), 0.22) 0%,
		transparent 70%
	);
	transition: opacity var(--speed-base) var(--ease-out);
}

.button-card:hover::after {
	opacity: 1;
}

.button-card-title {
	font-size: 1.125rem;
	font-weight: 700;
	letter-spacing: 0.01em;
}

.button-card-icon {
	border-radius: var(--radius-pill);
	background: rgba(var(--v-theme-primary), 0.1);
	border: 0.0625rem solid rgba(var(--v-theme-primary), 0.22);
	transition:
		transform var(--speed-base) var(--ease-out),
		background-color var(--speed-base) var(--ease-out);
}

.button-card:hover .button-card-icon {
	transform: scale(1.05);
	background: rgba(var(--v-theme-primary), 0.18);
}

.button-card-image {
	width: 100%;
	align-self: stretch;
	transition: transform var(--speed-base) var(--ease-out);
}

.button-card:hover .button-card-image {
	transform: scale(1.03);
}

.button-card-text {
	font-size: 0.9375rem;
	line-height: 1.5;
	opacity: 0.85;
}
</style>
