<template>
	<v-card class="mb-2" variant="flat" elevation="4" rounded="lg">
		<v-card-title class="d-flex align-center justify-space-between py-2">
			<span class="text-subtitle-1 font-weight-medium">Languages</span>
			<span
				v-if="!loading && totalBytes"
				class="text-caption text-medium-emphasis">
				{{ totalBytes.toLocaleString() }} bytes
			</span>
		</v-card-title>
		<v-divider />
		<v-card-text class="pt-4 pb-3">
			<v-progress-linear v-if="loading" indeterminate height="8" rounded />
			<div v-else>
				<div
					v-if="segments.length"
					class="d-flex w-100 rounded"
					style="overflow: hidden; height: 0.5rem"
					aria-label="Repository language usage">
					<div
						v-for="l in segments"
						:key="l.name"
						class="segment"
						:style="{ width: l.percent + '%', backgroundColor: l.color }" />
				</div>
				<div v-else class="text-center text-medium-emphasis text-caption py-2">
					No language data
				</div>

				<v-row class="mt-3" dense>
					<v-col
						v-for="l in segments"
						:key="l.name + '-legend'"
						cols="12"
						md="4"
						lg="3"
						class="d-flex align-center py-1">
						<span class="legend mr-2" :style="{ backgroundColor: l.color }" />
						<span class="text-body-2">{{ l.name }}</span>
						<span class="text-caption text-medium-emphasis ms-auto">
							{{ l.percent.toFixed(1) }}%
						</span>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
	</v-card>
</template>
<script setup lang="ts">
import { langColorMap } from '@/constants/languageColors'
import { Language } from '@/types/github'
import { computed } from 'vue'

const props = defineProps<{
	loading: boolean
	languages: Language[] | undefined
}>()

interface Segment extends Language {
	percent: number
	color: string
}

const totalBytes = computed(
	() => props.languages?.reduce((a, c) => a + c.count, 0) ?? 0
)

const segments = computed<Segment[]>(() => {
	if (!totalBytes.value || !props.languages) return []
	return (
		props.languages
			.slice()
			.sort((a, b) => b.count - a.count)
			.map((l) => ({
				...l,
				color: langColorMap[l.name],
				percent: (l.count / totalBytes.value) * 100,
			})) ?? []
	)
})
</script>
<style scoped lang="scss">
.lang-bar {
	height: 0.5rem;
	overflow: hidden;
}

.segment {
	transition: flex-grow 0.3s ease;
	outline: 0.1rem solid black;

	&:hover {
		filter: brightness(1.15);
	}
}

.legend {
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 50%;
}
</style>
