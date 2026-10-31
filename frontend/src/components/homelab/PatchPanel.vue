<template>
	<div
		class="patch-panel rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="24 port patch panel"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<Box3D :w="FACE_W" :h="U - 4" :d="24" face-class="panel-face" :style="pos">
			<template #front>
				<div class="panel-front">
					<div class="ports">
						<div v-for="port in 24" :key="port" class="port">
							<div class="port-jack" />
						</div>
					</div>
					<div class="label-strip" />
				</div>
			</template>
		</Box3D>
	</div>
</template>
<script setup lang="ts">
import Box3D from './Box3D.vue'
import { FACE_W, U } from './rack3d'

defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const pos = { transform: 'translate3d(0px, 2px, 1px)' }
</script>
<style scoped lang="scss">
@use './device' as *;

.panel-front {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 2px 18px;
	background: linear-gradient(180deg, #26262a, #17171a);
}

.ports {
	display: flex;
	gap: 2.5px;
	justify-content: center;
}

.port {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10px;
	height: 12px;
	background: #0c0c0e;
	border: 1px solid #3a3a40;
	border-radius: 1px;
}

.port-jack {
	width: 6px;
	height: 7px;
	background: linear-gradient(180deg, #1f1f24, #0a0a0c);
	border-top: 1.5px solid #c9a227;
}

.label-strip {
	height: 4px;
	margin: 2px 4px 0;
	background: repeating-linear-gradient(
		90deg,
		#dcdcdc 0 10px,
		#aaa 10px 10.5px
	);
	border-radius: 1px;
}
</style>
<style lang="scss">
@use './device' as *;

.panel-face {
	@include steel(#2c2c30, #1b1b1e);
}
</style>
