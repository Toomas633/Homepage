<template>
	<div v-if="!hideChips" class="chips">
		<LicenseChip :license="data?.license" :loading="loading" />
		<ArchiveChip
			v-if="newPage && newLink"
			:new-page="newPage"
			:new-link="newLink" />
		<LatestReleaseChip
			v-if="!hideVersion"
			:release="data?.latestRelease ?? ''"
			:loading="loading" />
	</div>
	<LangGraph
		v-if="!hideLangs"
		:languages="data?.languages"
		:loading="loading" />
</template>
<script setup lang="ts">
import { getRepoInfo } from '@/services/githubService'
import { RepoInfo } from '@/types/github'
import { onMounted, ref } from 'vue'

const props = defineProps<{
	repo: string
	newPage?: string
	newLink?: string
	hideLangs?: boolean
	hideChips?: boolean
	hideVersion?: boolean
}>()

const loading = ref(true)
const data = ref<RepoInfo | undefined>(undefined)

onMounted(async () => {
	data.value = await getRepoInfo(props.repo).then((resp) => {
		loading.value = false
		return resp
	})
})
</script>
<style scoped lang="scss">
.chips {
	text-align: center;
	margin-bottom: 0.5rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
}
</style>
