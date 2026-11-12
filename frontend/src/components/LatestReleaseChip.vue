<template>
	<v-chip
		class="stat-chip font-weight-bold"
		prepend-icon="mdi-tag-outline"
		variant="tonal"
		size="large"
		border
		color="light-green">
		<v-icon v-if="loading" icon="mdi-loading" class="mdi-spin" />
		<span v-else class="stat-chip-value">
			{{ release }}
		</span>
	</v-chip>
</template>
<script setup lang="ts">
defineProps<{
	release: string
	loading: boolean
}>()
</script>
<style scoped lang="scss">
.stat-chip {
	letter-spacing: 0.02em;
}

.stat-chip-value {
	margin: 0;
}
</style>
