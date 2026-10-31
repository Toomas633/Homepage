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
					<div class="groups">
						<div v-for="group in 4" :key="group" class="group">
							<div class="numbers">
								<span v-for="port in 6" :key="port">
									{{ (group - 1) * 6 + port }}
								</span>
							</div>
							<div class="ports">
								<div v-for="port in 6" :key="port" class="port">
									<div class="port-jack" />
									<div class="port-clip" />
								</div>
							</div>
						</div>
					</div>
					<div class="panel-screw panel-screw-left" />
					<div class="panel-screw panel-screw-right" />
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
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #26262a, #17171a);
}

.groups {
	display: flex;
	gap: 10px;
}

.group {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.numbers {
	display: flex;
	gap: 2.5px;

	span {
		width: 10px;
		font-size: 3px;
		line-height: 1;
		color: #9a9ca1;
		text-align: center;
	}
}

.ports {
	display: flex;
	gap: 2.5px;
}

.port {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10px;
	height: 11px;
	background: #0c0c0e;
	border: 1px solid #3a3a40;
	border-radius: 1px;
}

.port-jack {
	width: 6px;
	height: 6px;
	background: linear-gradient(180deg, #1f1f24, #0a0a0c);
	border-top: 1.5px solid #c9a227;
}

.port-clip {
	position: absolute;
	bottom: 0.5px;
	left: 50%;
	width: 3px;
	height: 1.5px;
	background: #26262b;
	transform: translateX(-50%);
}

.panel-screw {
	position: absolute;
	top: 50%;
	width: 6px;
	height: 6px;
	background:
		linear-gradient(45deg, transparent 0 42%, #2a2a2e 44% 56%, transparent 58%),
		radial-gradient(circle, #85878c 0 45%, #4a4c51 100%);
	border-radius: 50%;
	transform: translateY(-50%);

	&.panel-screw-left {
		left: 5px;
	}

	&.panel-screw-right {
		right: 5px;
	}
}
</style>
<style lang="scss">
@use './device' as *;

.panel-face {
	@include steel(#2c2c30, #1b1b1e);
}
</style>
