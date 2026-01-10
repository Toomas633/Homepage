<template>
	<v-card class="text-center" justfy="center" elevation="4">
		<h1 v-if="title">
			{{ title }}
		</h1>
		<v-btn
			v-if="href && icon"
			icon
			:height="size"
			:width="size"
			class="pa-0"
			elevation="0"
			:class="[isDark ? 'bg-black' : '', props.text ? 'mb-0' : 'mb-9']"
			:aria-label="label ?? text ?? title"
			@click="navigate">
			<v-icon :icon="icon" :color="iconColor" :size="size" />
		</v-btn>
		<v-img
			v-if="image"
			:src="isDark && imageDark ? imageDark : image"
			rounded
			:height="imageSize"
			:class="[!text ? 'mb-5' : '', href ? 'cursor-pointer' : '']"
			@click="navigate" />
		<v-card-text v-if="text" class="pb-2 pr-2 pl-2">
			{{ text }}
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
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

function navigate() {
	if (props.href) {
		window.open(props.href, '_blank')
	}
}
</script>
