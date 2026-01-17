<template>
	<v-chip
		class="font-weight-bold"
		prepend-icon="mdi-update"
		:variant="isDark ? 'outlined' : 'elevated'"
		elevation="4"
		size="large"
		color="light-green">
		<v-icon v-if="loading" icon="mdi-loading" class="mdi-spin" />
		<p v-else>
			{{ release }}
		</p>
	</v-chip>
</template>
<script setup lang="ts">
import useThemeMixin from '@/helpers/themeMixin'

defineProps<{
	release: string
	loading: boolean
}>()

const { isDark } = useThemeMixin()
</script>
