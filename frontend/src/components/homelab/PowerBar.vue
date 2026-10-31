<template>
	<div
		class="power-bar rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="Infitronic INSV1001 power strip"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<Box3D :w="FACE_W" :h="U - 6" :d="44" face-class="alu-face" :style="pos">
			<template #front>
				<div class="bar-front">
					<div class="power-switch">
						<div class="switch-glow" />
					</div>
					<div class="sockets">
						<div v-for="socket in 9" :key="socket" class="socket">
							<div class="socket-pin socket-pin-left" />
							<div class="socket-pin socket-pin-right" />
							<div class="socket-earth socket-earth-top" />
							<div class="socket-earth socket-earth-bottom" />
						</div>
					</div>
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

const pos = { transform: 'translate3d(0px, 3px, 1px)' }
</script>
<style scoped lang="scss">
@use './device' as *;

.bar-front {
	position: absolute;
	inset: 0;
	display: flex;
	gap: 8px;
	align-items: center;
	padding: 0 14px;
}

.power-switch {
	position: relative;
	width: 16px;
	height: 14px;
	background: #1c1c1f;
	border: 1px solid #45464a;
	border-radius: 2px;
}

.switch-glow {
	position: absolute;
	inset: 2.5px 3px;
	background: linear-gradient(180deg, #ff6f60, #d32f2f);
	border-radius: 1px;
	box-shadow: 0 0 5px rgb(244 67 54 / 80%);
}

.sockets {
	display: flex;
	flex: 1;
	gap: 5px;
	justify-content: space-between;
}

.socket {
	position: relative;
	width: 20px;
	height: 20px;
	background: radial-gradient(circle, #0f0f11 0 55%, #232327 60% 100%);
	border: 1px solid #333;
	border-radius: 50%;
}

.socket-pin {
	position: absolute;
	top: 50%;
	width: 3.5px;
	height: 3.5px;
	background: #000;
	border-radius: 50%;
	box-shadow: inset 0 0 1px rgb(255 255 255 / 25%);
	transform: translateY(-50%);

	&.socket-pin-left {
		left: 3.5px;
	}

	&.socket-pin-right {
		right: 3.5px;
	}
}

.socket-earth {
	position: absolute;
	left: 50%;
	width: 4px;
	height: 1.5px;
	background: #8b8d92;
	transform: translateX(-50%);

	&.socket-earth-top {
		top: 2px;
	}

	&.socket-earth-bottom {
		bottom: 2px;
	}
}
</style>
<style lang="scss">
@use './device' as *;

.alu-face {
	@include brushed-alu;
}
</style>
