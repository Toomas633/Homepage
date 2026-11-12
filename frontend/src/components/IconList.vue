<template>
	<ul class="ml-0" :class="multicolumn ? 'multicolumn' : ''">
		<li v-for="(item, i) in items" :key="i" class="feature-item mb-1">
			<v-icon
				class="feature-bullet"
				:icon="item.icon"
				:color="item.color"
				aria-hidden="true" />
			<span>
				<b v-if="item.title">{{ item.title }}:</b>
				<template v-if="item.title"> </template>
				<LinkComponent v-if="item.href" :href="item.href" :text="item.text" />
				<template v-else>{{ item.text }}</template>
			</span>
		</li>
	</ul>
</template>
<script lang="ts" setup>
import { IconListItem } from '@/types/iconList'

defineProps<{
	multicolumn?: boolean
	items: IconListItem[]
}>()
</script>
<style scoped lang="scss">
.feature-item {
	display: flex;
	gap: 0.75rem;
	align-items: flex-start;
	break-inside: avoid;
	list-style: none;
	padding: 0.375rem 0.5rem;
	border-radius: var(--radius-md);
	transition: background-color var(--speed-fast) var(--ease-out);
}

.feature-item:hover {
	background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.feature-bullet {
	min-width: 1.75rem;
	width: 1.75rem;
	height: 1.75rem;
	border-radius: var(--radius-sm);
	background-color: rgba(var(--v-theme-primary), 0.12);
	flex: 0 0 auto;
	margin-top: 0.0625rem;
}
</style>
