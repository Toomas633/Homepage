<template>
	<div
		class="rack-shelf rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="1U rack shelf"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<!-- faceplate ears -->
		<Box3D
			:w="FACE_W"
			:h="U - 18"
			:d="3"
			face-class="shelf-face"
			:style="pos(0, 16, 1)" />
		<!-- shelf plate -->
		<Box3D
			:w="FACE_W - 40"
			:h="4"
			:d="SHELF_D"
			face-class="shelf-face"
			:style="pos(20, U - 6, 0)">
			<template #top>
				<div class="plate-vents" />
			</template>
		</Box3D>
	</div>
</template>
<script setup lang="ts">
import Box3D from './Box3D.vue'
import { FACE_W, U } from './rack3d'

defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const SHELF_D = 240

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.plate-vents {
	position: absolute;
	inset: 8px 14px;
	background-image: linear-gradient(
		90deg,
		rgb(0 0 0 / 70%) 0 14px,
		transparent 14px 22px
	);
	background-size: 22px 100%;
}
</style>
<style lang="scss">
@use './device' as *;

.shelf-face {
	@include steel(#303034, #1d1d20);
}
</style>
