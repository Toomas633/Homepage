<template>
	<div class="code-block" :class="inheritClass">
		<div v-if="lang" class="code-block-bar">
			<span class="code-block-dots" aria-hidden="true"> <i /><i /><i /> </span>
			<span class="code-block-lang">{{ lang }}</span>
			<CopyButton
				class="code-block-copy"
				inline
				:text-to-copy="normalizedCode"
				:disable-copy="disableCopy" />
		</div>
		<code class="position-relative d-block">
			<pre
				class="code-block-pre text-left overflow-auto"
				:class="lang ? 'code-block-pre-headed' : ''"
				:style="style"
				v-text="normalizedCode" />
			<CopyButton
				v-if="!lang"
				:text-to-copy="normalizedCode"
				:disable-copy="disableCopy" />
		</code>
	</div>
</template>
<script setup lang="ts">
import { computed, StyleValue } from 'vue'

const props = defineProps<{
	code: string
	lang?: string
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
<style scoped lang="scss">
.code-block {
	border-radius: var(--radius-md);
	overflow: hidden;
	border: 0.0625rem solid var(--surface-line);
	background-color: rgb(var(--v-theme-code));
	box-shadow: var(--shadow-sm);
}

.code-block-bar {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.375rem 0.75rem;
	border-bottom: 0.0625rem solid var(--surface-line);
	background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.code-block-dots {
	display: inline-flex;
	gap: 0.25rem;

	i {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: rgba(var(--v-theme-on-surface), 0.18);
	}
}

.code-block-lang {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	opacity: 0.6;
}

.code-block-copy {
	margin-left: auto;
}

.code-block-pre {
	border: 0;
	border-radius: 0;
	box-shadow: none;
	padding-right: 3rem;
}

.code-block-pre-headed {
	padding-top: 0.875rem;
	padding-right: 1.125rem;
}
</style>
