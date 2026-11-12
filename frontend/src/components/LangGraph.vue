<template>
	<v-card class="lang-card mb-4" variant="flat" elevation="0">
		<div class="lang-card-head d-flex align-center justify-space-between">
			<div class="d-flex align-center ga-2">
				<v-icon icon="mdi-code-tags" size="20" color="primary" />
				<span class="lang-card-label">Languages</span>
			</div>
			<span v-if="!loading && totalBytes" class="lang-card-meta">
				{{ formattedTotal }}
			</span>
		</div>
		<div class="lang-card-body">
			<v-progress-linear v-if="loading" indeterminate height="10" rounded />
			<template v-else>
				<div
					v-if="segments.length"
					class="lang-bar"
					aria-label="Repository language usage">
					<v-tooltip
						v-for="l in segments"
						:key="l.name"
						:text="`${l.name} — ${l.percent.toFixed(1)}%`"
						location="top">
						<template #activator="{ props: tip }">
							<div
								v-bind="tip"
								class="segment"
								:style="{ width: l.percent + '%', backgroundColor: l.color }" />
						</template>
					</v-tooltip>
				</div>
				<div v-else class="lang-card-empty">No language data</div>
				<div v-if="segments.length" class="lang-legend">
					<div
						v-for="l in segments"
						:key="l.name + '-legend'"
						class="lang-pill">
						<span class="legend" :style="{ backgroundColor: l.color }" />
						<span class="lang-pill-name">{{ l.name }}</span>
						<span class="lang-pill-pct">{{ l.percent.toFixed(1) }}%</span>
					</div>
				</div>
			</template>
		</div>
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

const formattedTotal = computed(() => {
	const bytes = totalBytes.value
	if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
	if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`
	return `${bytes} B`
})

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
.lang-card {
	background-color: rgb(var(--v-theme-surface));
	overflow: hidden;
}

.lang-card-head {
	padding: 0.875rem 1.25rem;
	border-bottom: 0.0625rem solid var(--surface-line);
}

.lang-card-label {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	opacity: 0.85;
}

.lang-card-meta {
	font-size: 0.75rem;
	font-variant-numeric: tabular-nums;
	opacity: 0.6;
}

.lang-card-body {
	padding: 1.125rem 1.25rem 1.25rem;
}

.lang-card-empty {
	text-align: center;
	font-size: 0.8125rem;
	opacity: 0.6;
	padding-block: 0.5rem;
}

.lang-bar {
	display: flex;
	width: 100%;
	height: 0.625rem;
	border-radius: var(--radius-pill);
	overflow: hidden;
	background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.segment {
	height: 100%;
	transition:
		filter var(--speed-fast) var(--ease-out),
		transform var(--speed-fast) var(--ease-out);

	&:hover {
		filter: brightness(1.25);
		transform: scaleY(1.4);
	}
}

.lang-legend {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1rem;
}

.lang-pill {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.3125rem 0.75rem;
	border-radius: var(--radius-pill);
	border: 0.0625rem solid var(--surface-line);
	background-color: rgba(var(--v-theme-on-surface), 0.04);
	font-size: 0.8125rem;
	line-height: 1;
	transition:
		border-color var(--speed-fast) var(--ease-out),
		transform var(--speed-fast) var(--ease-out);

	&:hover {
		transform: translateY(-0.0625rem);
		border-color: rgba(var(--v-theme-primary), 0.45);
	}
}

.lang-pill-name {
	font-weight: 600;
}

.lang-pill-pct {
	font-variant-numeric: tabular-nums;
	opacity: 0.6;
}

.legend {
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	flex: 0 0 auto;
}
</style>
