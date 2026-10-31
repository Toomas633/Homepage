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
	background: linear-gradient(180deg, #45454c 0%, #35353b 50%, #28282d 100%);
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
	inset: 24px 18px 38px;
	background: linear-gradient(180deg, #232327, #1a1a1e);
	border: 1px solid #0e0e11;
	border-radius: 8px;
	box-shadow:
		inset 0 1px 0 rgb(255 255 255 / 7%),
		0 2px 6px rgb(0 0 0 / 35%);
}

.door-glass {
	position: absolute;
	inset: 5px;
	overflow: hidden;
	background:
		linear-gradient(
			105deg,
			transparent 30%,
			rgb(220 230 245 / 11%) 38% 46%,
			transparent 52%
		),
		radial-gradient(
			ellipse 90% 70% at 50% 62%,
			rgb(255 178 92 / 8%) 0%,
			transparent 62%
		),
		linear-gradient(180deg, #202026 0%, #17171c 55%, #101013 100%);
	border-radius: 5px;
	box-shadow: inset 0 0 18px rgb(0 0 0 / 45%);
}

.plate-silhouette {
	position: absolute;
	bottom: 13%;
	left: 10%;
	width: 80%;
	height: 9px;
	background: linear-gradient(180deg, #6b6050 0%, #4e463a 55%, #322e2d 100%);
	border-radius: 1px;
	box-shadow: 0 3px 5px rgb(0 0 0 / 55%);

	&::after {
		position: absolute;
		inset: 0 0 55%;
		content: '';
		background: repeating-linear-gradient(
			90deg,
			rgb(255 255 255 / 7%) 0 2px,
			transparent 2px 4px
		);
	}
}

.gantry-silhouette {
	position: absolute;
	top: 15%;
	left: 6%;
	width: 88%;
	height: 7px;
	background: linear-gradient(180deg, #585860 0%, #3e3e45 70%, #2b2b30 100%);
	border-radius: 1px;
	box-shadow: 0 2px 4px rgb(0 0 0 / 45%);
}

.toolhead-silhouette {
	position: absolute;
	top: 17%;
	left: 43%;
	width: 18px;
	height: 20px;
	background: linear-gradient(180deg, #55555e 0%, #3c3c44 60%, #2a2a30 100%);
	border-radius: 2px 2px 4px 4px;
	box-shadow: 0 3px 5px rgb(0 0 0 / 50%);

	&::after {
		position: absolute;
		bottom: -3px;
		left: 50%;
		width: 4px;
		height: 4px;
		content: '';
		background: #55555c;
		transform: translateX(-50%);
		clip-path: polygon(0 0, 100% 0, 50% 100%);
	}
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
	background: linear-gradient(180deg, #3e3e45, #2a2a2f);

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
	background: linear-gradient(180deg, #3a3a40, #2a2a2f);
}

.top-glass {
	position: absolute;
	inset: 14px;
	background:
		linear-gradient(
			105deg,
			transparent 28%,
			rgb(220 230 245 / 12%) 36% 44%,
			transparent 50%
		),
		linear-gradient(180deg, rgb(24 24 30 / 92%), rgb(14 14 18 / 95%));
	border: 3px solid #121215;
	border-radius: 7px;
	box-shadow: inset 0 0 14px rgb(0 0 0 / 50%);
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
			radial-gradient(
				ellipse 60% 55% at 22% 0%,
				rgb(255 255 255 / 26%) 0%,
				rgb(255 255 255 / 8%) 45%,
				transparent 70%
			),
			linear-gradient(180deg, rgb(70 70 82 / 12%), rgb(35 35 44 / 14%));
		border: 1px solid rgb(220 222 226 / 70%);
		border-radius: 6px 6px 0 0;
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 30%);
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
		radial-gradient(
			ellipse 140% 90% at 25% 0%,
			rgb(255 255 255 / 14%) 0%,
			rgb(255 255 255 / 4%) 40%,
			transparent 66%
		),
		linear-gradient(180deg, rgb(62 62 70 / 90%), rgb(45 45 52 / 92%));
}
</style>
<style lang="scss">
.printer-face {
	background: linear-gradient(180deg, #46464d 0%, #36363c 45%, #2a2a2f 100%);
	border-radius: 7px;
}

.ams-face {
	background: linear-gradient(180deg, #f4f5f7 0%, #e4e6e9 55%, #dcdee2 100%);
	border-radius: 7px;
}
</style>
