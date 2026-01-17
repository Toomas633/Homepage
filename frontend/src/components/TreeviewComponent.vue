<template>
	<v-treeview
		:items="items"
		item-key="title"
		item-value="title"
		class="bg-secondary"
		expand-icon="mdi-folder"
		collapse-icon="mdi-folder-open"
		density="compact"
		fluid
		:open-all="openAll"
		open-on-click
		rounded>
		<template #prepend="{ item }">
			<v-icon v-if="!(item.file === 'folder' && item.children?.length)">
				{{ fileIcons[item.file as FileType] }}
			</v-icon>
		</template>
		<template #title="{ item }">
			<span>{{ item.title }}</span>
			<span v-if="item.comment" style="opacity: 0.5">
				({{ item.comment }})
			</span>
		</template>
	</v-treeview>
</template>
<script setup lang="ts">
import { fileIcons } from '@/constants/fileIcons'
import { FileType } from '@/enums/fileType'
import { TreeItem } from '@/types/treeview'

defineProps<{
	items: TreeItem[]
	openAll?: boolean
}>()
</script>
