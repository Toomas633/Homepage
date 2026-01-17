<template>
	<div>
		<code class="position-relative d-block">
			<pre
				class="pa-2 rounded text-left overflow-auto"
				:style="style"
				v-text="normalizedCode" />
			<CopyButton :text-to-copy="normalizedCode" :disable-copy="disableCopy" />
		</code>
	</div>
</template>
<script setup lang="ts">
import { computed, StyleValue } from 'vue'

const props = defineProps<{
	code: string
	disableCopy?: boolean
	inheritClass?: string
	style?: StyleValue
}>()

const normalizeBlock = (input: string): string => {
	const lines = input.replaceAll('\r\n', '\n').split('\n')

	while (lines.length > 0 && lines[0]?.trim() === '') {
		lines.shift()
	}
	while (lines.length > 0 && lines.at(-1)?.trim() === '') {
		lines.pop()
	}

	let minIndent: number | undefined
	for (const line of lines) {
		if (line.trim() === '') continue
		const indentMatch = line.match(/^[\t ]+/)
		const indentLength = indentMatch?.[0].length ?? 0
		minIndent =
			minIndent === undefined ? indentLength : Math.min(minIndent, indentLength)
	}

	if (!minIndent) {
		return lines.join('\n')
	}

	return lines
		.map((line) => {
			if (line.trim() === '') return ''
			return line.slice(minIndent)
		})
		.join('\n')
}

const normalizedCode = computed(() => normalizeBlock(props.code))
</script>
