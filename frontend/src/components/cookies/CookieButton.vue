<template>
	<v-btn
		class="cookie-button"
		icon="mdi-cookie"
		position="fixed"
		location="bottom right"
		aria-label="Manage cookie preferences"
		color="primary"
		@click="emit('reopenSelection')" />
</template>
<script setup lang="ts">
const emit = defineEmits<(event: 'reopenSelection') => void>()
</script>
<style scoped lang="scss">
.cookie-button {
	right: calc(0.25rem + var(--scrollbar-offset)) !important;
	bottom: 0.5rem !important;
}
</style>
