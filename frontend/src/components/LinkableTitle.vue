<template>
	<v-divider
		v-if="!hideDivider"
		class="mt-4 mb-2 border-opacity-100"
		thickness="2"
		:color="h1 ? 'primary' : ''" />
	<h1 v-if="h1" :id="tag" :class="centered ? 'text-center' : ''">
		<v-icon icon="mdi-link-variant" size="24" @click="setTag" />{{ title }}
	</h1>
	<h2 v-if="h2" :id="tag" :class="centered ? 'text-center' : ''">
		<v-icon icon="mdi-link-variant" size="24" @click="setTag" />{{ title }}
	</h2>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
	title: string
	centered?: boolean
	h1?: boolean
	h2?: boolean
	h3?: boolean
	hideDivider?: boolean
}>()

const tag = computed(() => props.title.toLowerCase().replaceAll(' ', '-'))

const setTag = () => {
	const hash = `#${tag.value}`
	if (globalThis.location.hash !== hash) {
		globalThis.location.hash = tag.value
	}
}
</script>
<style scoped lang="scss">
.v-icon {
	visibility: hidden;
	transition:
		opacity 0.15s ease-in-out,
		visibility 0.15s ease-in-out;
	margin-top: -0.25rem;
	margin-left: -1.5rem;
}

h1:hover .v-icon,
h1:focus-within .v-icon,
h2:hover .v-icon,
h2:focus-within .v-icon {
	visibility: visible;
	opacity: 1;
}
</style>
