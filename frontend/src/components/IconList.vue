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
	gap: 0.6rem;
	align-items: flex-start;
	break-inside: avoid;
}

.feature-bullet {
	min-width: 1.25rem;
	line-height: 1.4;
}
</style>
