<template>
	<a :href="href" target="_blank" rel="noopener">
		<v-icon v-if="icon" :icon="icon" />{{ text ?? href }}
	</a>
</template>
<script setup lang="ts">
defineProps<{
	href: string
	text?: string
	icon?: string
}>()
</script>
<style scoped lang="scss">
a {
	color: rgb(var(--v-theme-primary));
	font-weight: 600;
	text-decoration: none;
	background-image: linear-gradient(
		90deg,
		rgba(var(--v-theme-primary), 0.7),
		rgba(var(--v-theme-primary), 0.7)
	);
	background-size: 0 0.0625rem;
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size var(--speed-base) var(--ease-out);
}

a:hover,
a:focus-visible {
	background-size: 100% 0.0625rem;
}
</style>
