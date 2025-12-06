<template>
	<v-chip
		class="font-weight-bold"
		prepend-icon="mdi-license"
		:variant="isDark ? 'outlined' : 'elevated'"
		elevation="4"
		size="large"
		color="orange">
		<v-icon v-if="loading" icon="mdi-loading" class="mdi-spin" />
		<p v-else>
			{{ license?.spdx_id.replace(/-/g, ' ') }}
		</p>
	</v-chip>
</template>
<script setup lang="ts">
import useThemeMixin from '@/helpers/themeMixin'
import { License } from '@/types/github'

defineProps<{
	loading: boolean
	license?: License
}>()

const { isDark } = useThemeMixin()
</script>
