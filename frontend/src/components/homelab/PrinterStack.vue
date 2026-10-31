<template>
	<div class="printer-stack">
		<!-- Bambu Lab P2S -->
		<div
			class="printer rack-device"
			:class="{ selected: selectedId === 'bambu-p2s' }"
			role="button"
			tabindex="0"
			aria-label="Bambu Lab P2S 3D printer"
			@click.stop="emit('select', 'bambu-p2s')"
			@keyup.enter="emit('select', 'bambu-p2s')">
			<Box3D
				:w="P_W"
				:h="P_H"
				:d="P_D"
				face-class="printer-face"
				:style="pos(P_X, -P_H, P_Z)">
				<template #front>
					<div class="printer-front">
						<div class="printer-brand">BAMBU LAB</div>
						<div class="model-label">P2S</div>
						<div class="door">
							<div class="door-glass">
								<div class="gantry-silhouette" />
								<div class="toolhead-silhouette" />
								<div class="plate-silhouette" />
							</div>
							<div class="door-handle" />
						</div>
						<div class="screen">
							<div class="screen-ui" />
						</div>
						<div class="intake-grille" />
					</div>
				</template>
				<template #left><div class="printer-side" /></template>
				<template #right>
					<div class="printer-side printer-side-vent" />
				</template>
				<template #top>
					<div class="printer-top">
						<div class="top-glass" />
					</div>
				</template>
			</Box3D>
		</div>
		<!-- AMS 2 Pro -->
		<div
			class="ams rack-device"
			:class="{ selected: selectedId === 'ams-2-pro' }"
			role="button"
			tabindex="0"
			aria-label="Bambu Lab AMS 2 Pro"
			@click.stop="emit('select', 'ams-2-pro')"
			@keyup.enter="emit('select', 'ams-2-pro')">
			<Box3D
				:w="AMS_W"
				:h="AMS_H"
				:d="AMS_D"
				face-class="ams-face"
				:style="pos(P_X + (P_W - AMS_W) / 2, -P_H - AMS_H, P_Z - 20)">
				<template #front>
					<div class="ams-front">
						<div class="ams-lid">
							<div v-for="(spool, i) in spools" :key="i" class="spool">
								<div class="spool-filament" :style="{ background: spool }" />
								<div class="spool-hub" />
							</div>
						</div>
						<div class="ams-base">
							<div class="slot-leds">
								<div v-for="slot in 4" :key="slot" class="slot-led" />
							</div>
							<div class="ams-label">AMS 2 PRO</div>
							<div class="ams-led" />
						</div>
					</div>
				</template>
				<template #top><div class="ams-top" /></template>
			</Box3D>
		</div>
	</div>
</template>
<script setup lang="ts">
import Box3D from './Box3D.vue'
import { FACE_W } from './rack3d'

defineProps<{ selectedId?: string | null }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()

const P_W = 270
const P_H = 280
const P_D = 270
const P_X = (FACE_W - P_W) / 2
const P_Z = -36

const AMS_W = 250
const AMS_H = 104
const AMS_D = 192

const spools = ['#d32f2f', '#f5f5f5', '#222', '#fb8c00']

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.printer-stack {
	position: absolute;
	width: 0;
	height: 0;
	transform-style: preserve-3d;
}

.printer-front {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, #37373c, #222226);
}

.printer-brand {
	position: absolute;
	top: 8px;
	left: 14px;
	font-size: 7px;
	font-weight: 700;
	letter-spacing: 1.5px;
	color: #b9bcc2;
}

.model-label {
	position: absolute;
	top: 8px;
	right: 14px;
	font-size: 7px;
	font-weight: 700;
	letter-spacing: 1px;
	color: #7d8086;
}

.door {
	position: absolute;
	inset: 24px 20px 40px;
	background: #1a1a1e;
	border: 2px solid #121215;
	border-radius: 6px;
}

.door-glass {
	position: absolute;
	inset: 3px;
	overflow: hidden;
	background:
		linear-gradient(
			115deg,
			transparent 0 30%,
			rgb(255 255 255 / 7%) 30% 42%,
			transparent 42% 70%,
			rgb(255 255 255 / 4%) 70% 78%,
			transparent 78%
		),
		linear-gradient(180deg, #16161a, #0c0c0f);
	border-radius: 4px;
}

.plate-silhouette {
	position: absolute;
	bottom: 14%;
	left: 12%;
	width: 76%;
	height: 7px;
	background: linear-gradient(180deg, #3b3b40, #26262a);
	border-radius: 1px;
}

.gantry-silhouette {
	position: absolute;
	top: 16%;
	left: 8%;
	width: 84%;
	height: 5px;
	background: linear-gradient(180deg, #313136, #202024);
}

.toolhead-silhouette {
	position: absolute;
	top: 16%;
	left: 44%;
	width: 16px;
	height: 16px;
	background: linear-gradient(180deg, #45454b, #2c2c31);
	border-radius: 0 0 3px 3px;
}

.door-handle {
	position: absolute;
	top: 46%;
	right: -1px;
	width: 5px;
	height: 34px;
	background: linear-gradient(90deg, #4c4c52, #333338);
	border-radius: 3px 0 0 3px;
}

.screen {
	position: absolute;
	right: 24px;
	bottom: 12px;
	width: 46px;
	height: 22px;
	overflow: hidden;
	background: linear-gradient(135deg, #1f2d3d, #0d1521);
	border: 2px solid #0a0a0c;
	border-radius: 3px;
	box-shadow: 0 0 6px rgb(30 136 229 / 30%);
}

.screen-ui {
	position: absolute;
	inset: 3px 4px;
	background: linear-gradient(
		180deg,
		rgb(66 165 245 / 45%) 0 4px,
		transparent 4px 7px,
		rgb(255 255 255 / 18%) 7px 9px,
		transparent 9px 11px,
		rgb(255 255 255 / 12%) 11px 13px,
		transparent 13px
	);
}

.intake-grille {
	position: absolute;
	bottom: 10px;
	left: 20px;
	width: 60px;
	height: 16px;
	background: repeating-linear-gradient(
		90deg,
		rgb(0 0 0 / 65%) 0 3px,
		transparent 3px 6px
	);
	border-radius: 2px;
}

.printer-side {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, #333338, #202024);

	&::after {
		position: absolute;
		inset: 20px 20px 30px;
		content: '';
		border: 1px solid rgb(255 255 255 / 5%);
		border-radius: 6px;
	}
}

.printer-side-vent::before {
	position: absolute;
	right: 24px;
	bottom: 18px;
	width: 56px;
	height: 34px;
	content: '';
	background: repeating-linear-gradient(
		0deg,
		rgb(0 0 0 / 60%) 0 3px,
		transparent 3px 6px
	);
	border-radius: 3px;
}

.printer-top {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, #2e2e33, #1e1e22);
}

.top-glass {
	position: absolute;
	inset: 14px;
	background:
		linear-gradient(
			115deg,
			transparent 0 28%,
			rgb(255 255 255 / 10%) 28% 40%,
			transparent 40%
		),
		linear-gradient(180deg, rgb(16 16 20 / 92%), rgb(10 10 13 / 95%));
	border: 3px solid #121215;
	border-radius: 5px;
}

.ams-front {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
}

.ams-lid {
	position: relative;
	display: flex;
	flex: 1;
	gap: 6px;
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #1c1c21, #121216);
	border-radius: 4px 4px 0 0;

	/* clear lid sits in front of the spools */
	&::after {
		position: absolute;
		inset: 0;
		content: '';
		background:
			linear-gradient(
				115deg,
				transparent 0 22%,
				rgb(255 255 255 / 30%) 22% 38%,
				transparent 38% 68%,
				rgb(255 255 255 / 12%) 68% 76%,
				transparent 76%
			),
			linear-gradient(180deg, rgb(70 70 82 / 34%), rgb(35 35 44 / 44%));
		border: 2px solid rgb(200 202 206 / 55%);
		border-radius: 4px 4px 0 0;
	}
}

.spool {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: rgb(240 240 240 / 85%);
	border-radius: 50%;
	box-shadow: inset 0 0 4px rgb(0 0 0 / 40%);
}

.spool-filament {
	position: absolute;
	inset: 4px;
	border-radius: 50%;

	&::after {
		position: absolute;
		inset: 0;
		content: '';
		background: repeating-radial-gradient(
			circle,
			transparent 0 2.5px,
			rgb(0 0 0 / 18%) 2.5px 3.5px
		);
		border-radius: 50%;
	}
}

.spool-hub {
	position: relative;
	width: 12px;
	height: 12px;
	background: radial-gradient(circle, #121214 0 45%, #e9e9ea 52% 100%);
	border-radius: 50%;
}

.ams-base {
	position: relative;
	display: flex;
	gap: 8px;
	align-items: center;
	height: 24%;
	padding: 0 14px;
	background: linear-gradient(180deg, #ececee, #cfd1d4);
	border-radius: 0 0 3px 3px;
}

.slot-leds {
	display: flex;
	gap: 48px;
	margin-left: 10px;
}

.slot-led {
	width: 4px;
	height: 4px;
	background: #42a5f5;
	border-radius: 50%;
	box-shadow: 0 0 3px #42a5f5;
}

.ams-label {
	margin-left: auto;
	font-size: 5px;
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #8a8c91;
}

.ams-led {
	width: 5px;
	height: 5px;
	background: #35d13c;
	border-radius: 50%;
	box-shadow: 0 0 4px #35d13c;
}

.ams-top {
	position: absolute;
	inset: 0;
	background:
		linear-gradient(
			115deg,
			transparent 0 30%,
			rgb(255 255 255 / 12%) 30% 40%,
			transparent 40%
		),
		linear-gradient(180deg, rgb(62 62 70 / 90%), rgb(45 45 52 / 92%));
}
</style>
<style lang="scss">
.printer-face {
	background: linear-gradient(180deg, #3a3a3f, #242428);
}

.ams-face {
	background: linear-gradient(180deg, #e8e9eb, #c6c8cc);
}
</style>
