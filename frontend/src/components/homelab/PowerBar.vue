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
					<div class="end-cap" />
					<div class="power-switch">
						<div class="switch-glow">
							<div class="rocker-line" />
						</div>
					</div>
					<div class="brand-tag">INFITRONIC</div>
					<div class="sockets">
						<div v-for="socket in 9" :key="socket" class="socket">
							<div class="socket-cup">
								<div class="socket-pin socket-pin-left" />
								<div class="socket-pin socket-pin-right" />
								<div class="socket-earth socket-earth-top" />
								<div class="socket-earth socket-earth-bottom" />
							</div>
						</div>
					</div>
					<div class="end-cap" />
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
	gap: 6px;
	align-items: center;
}

.end-cap {
	align-self: stretch;
	width: 8px;
	background: linear-gradient(180deg, #2a2a2e, #141417);
}

.power-switch {
	position: relative;
	width: 16px;
	height: 14px;
	margin-left: 2px;
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

.rocker-line {
	position: absolute;
	top: 2px;
	left: 50%;
	width: 1px;
	height: 3px;
	background: rgb(255 255 255 / 85%);
	transform: translateX(-50%);
}

.brand-tag {
	font-size: 3px;
	font-weight: 700;
	letter-spacing: 0.4px;
	color: #52545a;
	writing-mode: vertical-rl;
}

.sockets {
	display: flex;
	flex: 1;
	gap: 5px;
	justify-content: space-between;
	padding-right: 4px;
}

.socket {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 21px;
	height: 21px;
	background: #111113;
	border-radius: 50%;
	box-shadow:
		inset 0 1px 2px rgb(0 0 0 / 80%),
		0 0.5px 0 rgb(255 255 255 / 25%);
}

.socket-cup {
	position: relative;
	width: 15px;
	height: 15px;
	background: radial-gradient(circle, #060607 0 58%, #1d1d21 64% 100%);
	border-radius: 50%;
	box-shadow: inset 0 1.5px 3px rgb(0 0 0 / 90%);
}

.socket-pin {
	position: absolute;
	top: 50%;
	width: 3px;
	height: 3px;
	background: #000;
	border-radius: 50%;
	box-shadow: inset 0 0 1px rgb(255 255 255 / 25%);
	transform: translateY(-50%);

	&.socket-pin-left {
		left: 2.5px;
	}

	&.socket-pin-right {
		right: 2.5px;
	}
}

.socket-earth {
	position: absolute;
	left: 50%;
	width: 4px;
	height: 1.5px;
	background: #9ea0a5;
	border-radius: 1px;
	transform: translateX(-50%);

	&.socket-earth-top {
		top: 0.5px;
	}

	&.socket-earth-bottom {
		bottom: 0.5px;
	}
}
</style>
<style lang="scss">
@use './device' as *;

.alu-face {
	@include brushed-alu;
}
</style>
