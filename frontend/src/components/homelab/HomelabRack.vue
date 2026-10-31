<template>
	<div
		ref="sceneEl"
		class="scene"
		:class="{ dragging }"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
		@click="onBackgroundClick">
		<div class="world" :style="worldStyle">
			<div class="rack-origin">
				<div class="floor" />
				<div class="interior" />
				<RackFrame :selected="selectedId === 'rack'" @select="select('rack')" />
				<div class="slot" :style="slotStyle(1, 2)">
					<ServerR730
						:selected="selectedId === 'r730'"
						@select="select('r730')" />
				</div>
				<div class="slot" :style="slotStyle(10)">
					<PatchPanel
						:selected="selectedId === 'patch-panel'"
						@select="select('patch-panel')" />
				</div>
				<div class="slot" :style="slotStyle(11)">
					<UnifiSwitch
						:selected="selectedId === 'unifi-switch'"
						@select="select('unifi-switch')" />
				</div>
				<div class="slot" :style="slotStyle(13)">
					<LipoDrawer
						:selected="selectedId === 'lipo-drawer'"
						@select="select('lipo-drawer')" />
				</div>
				<div class="slot" :style="slotStyle(14)">
					<RackShelf
						:selected="selectedId === 'shelf'"
						@select="select('shelf')" />
				</div>
				<div class="slot" :style="slotStyle(15)">
					<PowerBar
						:selected="selectedId === 'power-bar'"
						@select="select('power-bar')" />
				</div>
				<PrinterStack
					:selected-id="selectedId"
					:style="printerStyle"
					@select="select" />
				<AcPro
					:selected="selectedId === 'ac-pro'"
					:style="acProStyle"
					@select="select('ac-pro')" />
			</div>
		</div>
		<div class="controls">
			<v-btn
				icon="mdi-magnify-plus-outline"
				size="x-small"
				variant="tonal"
				aria-label="Zoom in"
				@click.stop="zoomBy(0.1)" />
			<v-btn
				icon="mdi-magnify-minus-outline"
				size="x-small"
				variant="tonal"
				aria-label="Zoom out"
				@click.stop="zoomBy(-0.1)" />
			<v-btn
				icon="mdi-restore"
				size="x-small"
				variant="tonal"
				aria-label="Reset view"
				@click.stop="resetView" />
		</div>
		<div class="hint">
			Drag to rotate &bull; Click a component to inspect it
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import RackFrame from './RackFrame.vue'
import ServerR730 from './ServerR730.vue'
import PatchPanel from './PatchPanel.vue'
import UnifiSwitch from './UnifiSwitch.vue'
import LipoDrawer from './LipoDrawer.vue'
import RackShelf from './RackShelf.vue'
import PowerBar from './PowerBar.vue'
import PrinterStack from './PrinterStack.vue'
import AcPro from './AcPro.vue'
import { FACE_W, FRAME_H, slotTop } from './rack3d'

defineProps<{ selectedId: string | null }>()
const emit = defineEmits<{ (e: 'select', id: string | null): void }>()

const DEFAULT_YAW = -12
const DEFAULT_PITCH = -7
const DEFAULT_ZOOM = 0.56

const sceneEl = ref<HTMLElement>()
const yaw = ref(DEFAULT_YAW)
const pitch = ref(DEFAULT_PITCH)
const zoom = ref(DEFAULT_ZOOM)
const dragging = ref(false)
const dragMoved = ref(0)

let lastX = 0
let lastY = 0
let capturedPointer: number | null = null

const worldStyle = computed(() => ({
	transform: `scale3d(${zoom.value}, ${zoom.value}, ${zoom.value}) rotateX(${pitch.value}deg) rotateY(${yaw.value}deg)`,
}))

const printerStyle = computed(() => ({
	transform: `translate3d(0px, ${-FRAME_H}px, 0px)`,
}))

const acProStyle = computed(() => ({
	transform: `translate3d(${FACE_W + 2}px, 140px, -120px) rotateY(74deg)`,
}))

function slotStyle(slot: number, units = 1) {
	return {
		transform: `translate3d(0px, ${slotTop(slot, units)}px, 0px)`,
	}
}

function select(id: string) {
	emit('select', id)
}

function onPointerDown(event: PointerEvent) {
	dragging.value = true
	dragMoved.value = 0
	lastX = event.clientX
	lastY = event.clientY
	capturedPointer = null
}

function onPointerMove(event: PointerEvent) {
	if (!dragging.value) return
	const dx = event.clientX - lastX
	const dy = event.clientY - lastY
	lastX = event.clientX
	lastY = event.clientY
	dragMoved.value += Math.abs(dx) + Math.abs(dy)
	if (dragMoved.value > 4 && capturedPointer === null) {
		capturedPointer = event.pointerId
		try {
			sceneEl.value?.setPointerCapture(event.pointerId)
		} catch {
			// pointer capture is unsupported for this pointer, dragging still works
		}
	}
	yaw.value = clamp(yaw.value + dx * 0.35, -85, 85)
	pitch.value = clamp(pitch.value - dy * 0.25, -35, 6)
}

function onPointerUp(event: PointerEvent) {
	dragging.value = false
	if (capturedPointer === event.pointerId) {
		try {
			sceneEl.value?.releasePointerCapture(event.pointerId)
		} catch {
			// pointer was never captured
		}
		capturedPointer = null
	}
}

function onBackgroundClick() {
	if (dragMoved.value > 6) return
	emit('select', null)
}

function zoomBy(delta: number) {
	zoom.value = clamp(zoom.value + delta, 0.3, 1.4)
}

function resetView() {
	yaw.value = DEFAULT_YAW
	pitch.value = DEFAULT_PITCH
	zoom.value = DEFAULT_ZOOM
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}
</script>
<style scoped lang="scss">
.scene {
	position: relative;
	width: 100%;
	height: 640px;
	overflow: hidden;
	touch-action: none;
	cursor: grab;
	user-select: none;
	background:
		radial-gradient(
			ellipse 120% 70% at 50% 108%,
			rgb(0 0 0 / 55%) 0%,
			transparent 60%
		),
		radial-gradient(ellipse 60% 45% at 50% 35%, #55555e 0%, transparent 70%),
		radial-gradient(ellipse at 50% 30%, #44444c 0%, #343439 52%, #232327 100%);
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	perspective: 1100px;
	perspective-origin: 50% 12%;

	&.dragging {
		cursor: grabbing;
	}
}

.world {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	transform-style: preserve-3d;
}

.rack-origin {
	position: absolute;
	width: 0;
	height: 0;
	transform: translate3d(-165px, -75px, 200px);
	transform-style: preserve-3d;
}

.slot {
	position: absolute;
	width: 0;
	height: 0;
	transform-style: preserve-3d;
}

.floor {
	position: absolute;
	top: 0;
	left: 0;
	width: 1300px;
	height: 1100px;
	background:
		radial-gradient(
			ellipse 150px 70px at 32% 42%,
			rgb(0 0 0 / 70%) 0 40%,
			transparent 75%
		),
		radial-gradient(
			ellipse 150px 70px at 68% 42%,
			rgb(0 0 0 / 70%) 0 40%,
			transparent 75%
		),
		radial-gradient(
			ellipse 460px 320px at 50% 45%,
			rgb(0 0 0 / 45%) 0 32%,
			rgb(0 0 0 / 16%) 58%,
			transparent 74%
		);
	transform: translate3d(-485px, 505px, 320px) rotateX(90deg)
		translateY(-1100px);
	transform-origin: 0 0;
}

/* dark interior behind the open frame so empty slots don't show the backdrop */
.interior {
	position: absolute;
	top: -20px;
	left: 4px;
	width: 322px;
	height: 490px;
	background:
		radial-gradient(
			ellipse 70% 55% at 50% 42%,
			rgb(40 40 46 / 55%) 0%,
			transparent 75%
		),
		linear-gradient(180deg, #141418 0%, #0e0e11 60%, #09090b 100%);
	transform: translateZ(-382px);
}

.controls {
	position: absolute;
	right: 10px;
	bottom: 10px;
	display: flex;
	gap: 6px;
}

.hint {
	position: absolute;
	bottom: 12px;
	left: 14px;
	font-size: 0.75rem;
	color: rgb(255 255 255 / 55%);
	pointer-events: none;
}
</style>
<style lang="scss">
.rack-device {
	position: absolute;
	width: 0;
	height: 0;
	cursor: pointer;
	transform-style: preserve-3d;

	.face {
		transition:
			box-shadow 0.25s ease,
			filter 0.25s ease;
	}

	&:hover .face {
		filter: brightness(1.15);
	}

	&.selected .face {
		box-shadow:
			inset 0 0 0 1.5px rgb(244 67 54 / 95%),
			0 0 10px rgb(244 67 54 / 45%);
		filter: brightness(1.12);
	}
}
</style>
