<template>
	<v-chip
		class="stat-chip font-weight-bold"
		prepend-icon="mdi-license"
		variant="tonal"
		size="large"
		border
		color="orange">
		<v-icon v-if="loading" icon="mdi-loading" class="mdi-spin" />
		<span v-else class="stat-chip-value">
			{{ license?.spdx_id.replace(/-/g, ' ') }}
		</span>
	</v-chip>
</template>
<script setup lang="ts">
import { License } from '@/types/github'

defineProps<{
	loading: boolean
	license?: License
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
