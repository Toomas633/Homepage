<template>
	<code class="position-relative" @mousedown="copyCode(code)">
		<mark>
			<span v-text="code" />
			<v-tooltip
				v-if="isDesktop"
				activator="parent"
				location="bottom"
				aria-label="Click to copy">
				<v-icon
					:icon="
						copied ? (!error ? 'mdi-check' : 'mdi-close') : 'mdi-content-copy'
					" />
				{{ copied ? (!error ? 'Copied' : 'Error') : 'Copy' }}
			</v-tooltip>
		</mark>
	</code>
</template>
<script setup lang="ts">
import useCopyMixin from '@/helpers/copyMixin'
import { isDesktop } from '@basitcodeenv/vue3-device-detect'

defineProps<{
	code: string
	disableCopy?: boolean
}>()

const { copied, error, copy } = useCopyMixin()

const copyCode = async (code: string) => {
	if (isDesktop) {
		await copy(code)
	}
}
</script>
