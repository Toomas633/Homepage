<template>
	<div class="r730 rack-device" :class="{ selected, open: selected }">
		<!-- static mounting rails, visible when the server slides out -->
		<Box3D
			v-for="rail in rails"
			:key="rail.key"
			:w="4"
			:h="12"
			:d="RACK_D - 10"
			face-class="r730-rail-face"
			:style="rail.style" />
		<div
			class="chassis"
			role="button"
			tabindex="0"
			aria-label="Dell PowerEdge R730"
			@click.stop="emit('select')"
			@keyup.enter="emit('select')">
			<Box3D
				:w="CH_W"
				:h="CH_H"
				:d="CH_D"
				face-class="r730-face"
				hide-top
				:style="pos(EAR_W, 2, 0)">
				<template #front>
					<div class="front-panel">
						<div class="bays">
							<div
								v-for="bay in 16"
								:key="bay"
								class="tray"
								:class="`tray-s${bay % 5}`">
								<div class="tray-leds">
									<div class="tray-led tray-led-act" />
									<div class="tray-led tray-led-status" />
								</div>
								<div class="tray-handle">
									<div class="tray-latch" />
								</div>
								<div class="tray-vents" />
							</div>
						</div>
						<div class="badge-strip">
							<div class="dell-badge">DELL</div>
							<span class="model-tag">PowerEdge</span>
							<span class="model-tag model-num">R730</span>
						</div>
					</div>
				</template>
				<template #back>
					<div class="rear-panel">
						<div class="psu" />
						<div class="psu" />
						<div class="io-block" />
					</div>
				</template>
				<template #left><div class="side-panel" /></template>
				<template #right><div class="side-panel" /></template>
			</Box3D>
			<!-- rack ears with control panels -->
			<div class="ear ear-left" :style="pos(0, 2, 1)">
				<div class="power-btn" />
				<div class="led led-health" />
				<div class="led led-id" />
				<div class="ear-screw" />
			</div>
			<div class="ear ear-right" :style="pos(FACE_W - EAR_W, 2, 1)">
				<div class="usb-port" />
				<div class="usb-port" />
				<div class="vga-port" />
				<div class="ear-screw" />
			</div>
			<!-- internals, exposed when the lid is removed -->
			<div class="internals" :style="internalsStyle">
				<div class="zone-rear">
					<div class="riser" />
					<div class="riser" />
					<div class="psu-top" />
					<div class="psu-top" />
				</div>
				<div class="zone-board">
					<div class="dimm-bank" />
					<div class="heatsink" />
					<div class="dimm-bank" />
					<div class="heatsink" />
					<div class="dimm-bank" />
				</div>
				<div class="zone-fans">
					<div v-for="fan in 6" :key="fan" class="fan">
						<div class="fan-hub" />
					</div>
				</div>
				<div class="zone-backplane" />
			</div>
			<!-- removable lid -->
			<div class="lid" :style="lidStyle">
				<div class="lid-latch">
					<div class="latch-release" />
				</div>
				<div class="lid-label" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Box3D from './Box3D.vue'
import { FACE_W, RACK_D, U } from './rack3d'

const props = defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()

const EAR_W = 14
const CH_W = FACE_W - 2 * EAR_W
const CH_H = 2 * U - 4
const CH_D = 440

const rails = computed(() => [
	{ key: 'left', style: pos(EAR_W + 1, 2 + CH_H / 2 - 6, -6) },
	{ key: 'right', style: pos(FACE_W - EAR_W - 5, 2 + CH_H / 2 - 6, -6) },
])

const internalsStyle = computed(() => ({
	width: `${CH_W}px`,
	height: `${CH_D - 4}px`,
	transform: `translate3d(${EAR_W}px, 8px, -2px) rotateX(90deg) translateY(${-(CH_D - 4)}px)`,
	opacity: props.selected ? 1 : 0,
}))

const lidStyle = computed(() => {
	const base = `translate3d(${EAR_W}px, 2px, -36px)`
	const plane = `rotateX(90deg) translateY(${-(CH_D - 36)}px)`
	return {
		width: `${CH_W}px`,
		height: `${CH_D - 36}px`,
		transform: props.selected
			? `${base} translate3d(30px, -60px, -150px) rotateZ(4deg) ${plane}`
			: `${base} ${plane}`,
		opacity: props.selected ? 0 : 1,
	}
})

function pos(x: number, y: number, z: number) {
	return { transform: `translate3d(${x}px, ${y}px, ${z}px)` }
}
</script>
<style scoped lang="scss">
@use './device' as *;

.chassis {
	position: absolute;
	transform-style: preserve-3d;
	transition: transform 0.9s cubic-bezier(0.25, 0.8, 0.3, 1);
}

.open .chassis {
	transform: translateZ(185px);
}

.front-panel {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: stretch;
	background: linear-gradient(180deg, #2f2f34, #1d1d21);
}

.power-btn {
	width: 7px;
	height: 7px;
	background: radial-gradient(circle, #9ef79e 0 2px, #2e4a2e 2.4px, #111 70%);
	border: 1px solid #555;
	border-radius: 50%;
}

.led {
	width: 4px;
	height: 4px;
	border-radius: 50%;

	&.led-health {
		background: #38d13f;
		box-shadow: 0 0 3px #38d13f;
	}

	&.led-id {
		background: #1976d2;
		box-shadow: 0 0 3px #1976d2;
	}
}

.usb-port {
	width: 8px;
	height: 3.5px;
	background: #0a0a0c;
	border: 1px solid #4a4a50;
	border-radius: 0.5px;
}

.vga-port {
	width: 9px;
	height: 4.5px;
	background:
		radial-gradient(circle, #3a6ea5 0 0.6px, transparent 0.8px) 0 0 / 2px 2px,
		#10335c;
	border: 1px solid #4a4a50;
	border-radius: 2px;
}

.bays {
	display: grid;
	flex: 1;
	grid-template-columns: repeat(8, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 2px;
	padding: 2px 2px 2px 4px;
}

.tray {
	position: relative;
	overflow: hidden;
	background: linear-gradient(180deg, #34343a 0%, #28282d 55%, #1f1f24 100%);
	border: 1px solid #0c0c0e;
	border-radius: 1px;
	box-shadow: inset 0 1px 0 rgb(255 255 255 / 18%);

	/* varied LED states so the bays don't read as wallpaper */
	&.tray-s1 .tray-led-act {
		background: #ffb300;
		box-shadow: 0 0 1.5px #ffb300;
	}

	&.tray-s2 .tray-led-act {
		background: #173a1b;
		box-shadow: none;
	}

	&.tray-s3 .tray-led-status {
		background: #2fae35;
		box-shadow: 0 0 1.5px #2fae35;
	}
}

/* Dell 13G carrier: release handle across the top with a latch button */
.tray-handle {
	position: absolute;
	top: 1.5px;
	right: 2px;
	left: 7px;
	height: 4px;
	background: linear-gradient(180deg, #9aa0a8 0%, #7f858d 55%, #62676e 100%);
	border: 0.5px solid #1b1b1f;
	border-radius: 1px;
}

.tray-latch {
	position: absolute;
	top: 0.5px;
	left: 1px;
	width: 4px;
	height: 2.5px;
	background: linear-gradient(180deg, #6a6c71, #4a4c51);
	border-radius: 0.5px;
}

/* stacked activity + status LEDs on the left edge */
.tray-leds {
	position: absolute;
	top: 2px;
	bottom: 2px;
	left: 1.5px;
	display: flex;
	flex-direction: column;
	gap: 3px;
	align-items: center;
	justify-content: flex-start;
	width: 4px;
	padding-top: 1px;
}

.tray-led {
	width: 2px;
	height: 2px;
	border-radius: 50%;

	&.tray-led-act {
		background: #2fae35;
		box-shadow: 0 0 1px #2fae35;
	}

	&.tray-led-status {
		background: #1c3a20;
	}
}

.tray-vents {
	position: absolute;
	inset: 7px 2px 2px 7px;
	background-color: #232329;
	background-image: radial-gradient(
		circle,
		rgb(0 0 0 / 95%) 0 0.8px,
		transparent 1px
	);
	background-size: 3px 3px;
	box-shadow: inset 0 0.5px 1px rgb(0 0 0 / 60%);
}

.badge-strip {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: center;
	justify-content: center;
	width: 22px;
}

.dell-badge {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 13px;
	height: 13px;
	font-size: 4px;
	font-weight: 700;
	color: #e3e6ea;
	background: radial-gradient(circle at 38% 32%, #4a4a52 0 55%, #2c2c32 100%);
	border: 1px solid #7a7d84;
	border-radius: 50%;
	box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}

.model-tag {
	font-size: 4px;
	line-height: 1.1;
	color: #9aa0a6;
}

.model-num {
	font-weight: 700;
	color: #ced2d8;
}

.rear-panel {
	position: absolute;
	inset: 0;
	display: flex;
	gap: 6px;
	align-items: center;
	padding: 4px;
	background: #1d1d20;
}

.psu {
	width: 56px;
	height: 70%;
	background:
		radial-gradient(circle, rgb(0 0 0 / 90%) 0 0.8px, transparent 1px) 0 0 / 3px
			3px,
		linear-gradient(180deg, #303034, #202024);
	border: 1px solid #0f0f12;
}

.io-block {
	flex: 1;
	height: 55%;
	background: linear-gradient(180deg, #2b2b2f, #1a1a1e);
	border: 1px solid #0f0f12;
}

.side-panel {
	position: absolute;
	inset: 0;
	background:
		linear-gradient(90deg, rgb(255 255 255 / 4%) 0 2px, transparent 2px 56px),
		linear-gradient(180deg, #38383e, #222226);
}

.ear {
	position: absolute;
	display: flex;
	flex-direction: column;
	gap: 4px;
	align-items: center;
	justify-content: center;
	width: 14px;
	height: 56px;
	background: linear-gradient(180deg, #3a3a41 0%, #2b2b31 55%, #202024 100%);
	border: 1px solid #101013;
	border-radius: 0 0 2px 2px;
}

.ear-screw {
	width: 6px;
	height: 6px;
	margin-top: 3px;
	background: radial-gradient(circle, #6a6a70 0 40%, #3a3a3f 100%);
	border-radius: 50%;
}

.internals {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	transform-origin: 0 0;
	backface-visibility: hidden;
	background:
		radial-gradient(circle, rgb(255 255 255 / 3%) 0 0.6px, transparent 1px) 0
			0 / 5px 5px,
		linear-gradient(180deg, #0d2b1e, #0a2016);
	transition: opacity 0.5s ease 0.35s;
}

.zone-rear {
	display: flex;
	gap: 5px;
	align-items: center;
	height: 20%;
	padding: 4px 6px;
}

.riser {
	width: 18%;
	height: 80%;
	background: linear-gradient(180deg, #16341f, #0e2416);
	border: 1px solid #0a1a10;
}

.psu-top {
	width: 22%;
	height: 90%;
	margin-left: auto;
	background: linear-gradient(90deg, #54565c, #3a3c41);
	border: 1px solid #26272b;
}

.zone-board {
	display: flex;
	gap: 6px;
	align-items: stretch;
	height: 42%;
	padding: 5px 10px;
}

.dimm-bank {
	flex: 1;
	background: repeating-linear-gradient(
		90deg,
		#101d13 0 2px,
		#2ea043 2px 3.5px,
		#101d13 3.5px 8px
	);
	border: 1px solid #0a160d;
	border-radius: 1px;
}

.heatsink {
	flex: 1.2;
	background: repeating-linear-gradient(0deg, #b9bcc2 0 2px, #7d8087 2px 4px);
	border: 1px solid #5c5e63;
	border-radius: 2px;
	box-shadow: inset 0 0 6px rgb(0 0 0 / 35%);
}

.zone-fans {
	display: flex;
	gap: 4px;
	height: 18%;
	padding: 3px 8px;
}

.fan {
	position: relative;
	flex: 1;
	background:
		radial-gradient(
			circle at 50% 50%,
			#0a0a0c 0 38%,
			#2e2e33 40% 48%,
			#1a1a1e 50%
		),
		#232327;
	border: 1px solid #101013;
	border-radius: 2px;
}

.fan-hub {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 35%;
	height: 60%;
	background: radial-gradient(circle, #3f3f45 0 55%, #222 100%);
	border-radius: 50%;
	transform: translate(-50%, -50%);
}

.zone-backplane {
	flex: 1;
	margin: 2px 6px 4px;
	background: repeating-linear-gradient(
		90deg,
		#123524 0 10px,
		#0c2418 10px 12px
	);
	border: 1px solid #081a10;
}

.lid {
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: 0 0;
	background:
		linear-gradient(
			90deg,
			transparent 0 18%,
			rgb(255 255 255 / 5%) 18% 19%,
			transparent 19% 81%,
			rgb(255 255 255 / 5%) 81% 82%,
			transparent 82%
		),
		linear-gradient(180deg, #45454b 0%, #323237 55%, #3d3d43 100%);
	transition:
		transform 0.9s cubic-bezier(0.3, 0.7, 0.4, 1),
		opacity 0.7s ease 0.15s;
}

.lid-latch {
	position: absolute;
	top: 12%;
	left: 50%;
	width: 34px;
	height: 50px;
	background: linear-gradient(180deg, #505057, #3a3a40);
	border: 1px solid #27272c;
	border-radius: 3px;
	transform: translateX(-50%);
}

.latch-release {
	position: absolute;
	top: 6px;
	left: 50%;
	width: 14px;
	height: 10px;
	background: linear-gradient(180deg, #2f6fb2, #1d4e85);
	border-radius: 2px;
	transform: translateX(-50%);
}

/* Dell service information label */
.lid-label {
	position: absolute;
	top: 42%;
	left: 14%;
	width: 30%;
	height: 26%;
	background:
		repeating-linear-gradient(
			0deg,
			transparent 0 6px,
			rgb(0 0 0 / 14%) 6px 7px
		),
		linear-gradient(180deg, #b9bbbf, #a2a4a9);
	border: 1px solid #7f8186;
	border-radius: 2px;

	&::before {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 9px;
		content: '';
		background: linear-gradient(180deg, #1d6fb8, #15589a);
		border-radius: 1px 1px 0 0;
	}
}
</style>
<style lang="scss">
@use './device' as *;

.r730-rail-face {
	background: linear-gradient(180deg, #8b8d92, #5d5f64);
}

.r730-face {
	@include steel(#3a3a40, #242428);
}
</style>
