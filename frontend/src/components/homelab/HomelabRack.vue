<template>
	<div ref="containerEl" class="scene">
		<canvas v-show="webglOk" ref="canvasEl" class="scene-canvas" />
		<div v-if="!webglOk" class="webgl-fallback">
			<p>3D preview requires WebGL, which is unavailable in this browser.</p>
		</div>
		<div class="device-buttons">
			<button
				v-for="device in homelabComponents"
				:key="device.id"
				type="button"
				:aria-label="`Select ${device.name}`"
				:aria-pressed="selectedId === device.id"
				@click="emit('select', device.id)">
				{{ device.name }}
			</button>
		</div>
		<div class="controls">
			<v-btn
				icon="mdi-magnify-plus-outline"
				size="x-small"
				variant="tonal"
				aria-label="Zoom in"
				@click.stop="sceneApi?.zoomBy(0.85)" />
			<v-btn
				icon="mdi-magnify-minus-outline"
				size="x-small"
				variant="tonal"
				aria-label="Zoom out"
				@click.stop="sceneApi?.zoomBy(1.18)" />
			<v-btn
				icon="mdi-restore"
				size="x-small"
				variant="tonal"
				aria-label="Reset view"
				@click.stop="sceneApi?.resetView()" />
		</div>
		<div class="hint">Drag to orbit &bull; Click a component to inspect it</div>
	</div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { homelabComponents } from '@/constants/homelab'
import { createHomelabScene, type HomelabScene } from './three/scene'

const props = defineProps<{ selectedId: string | null }>()
const emit = defineEmits<{ (e: 'select', id: string | null): void }>()

const containerEl = ref<HTMLElement>()
const canvasEl = ref<HTMLCanvasElement>()
const webglOk = ref(true)

let sceneApi: HomelabScene | undefined
let resizeObserver: ResizeObserver | undefined

onMounted(() => {
	if (!canvasEl.value) {
		webglOk.value = false
		return
	}
	try {
		sceneApi = createHomelabScene(canvasEl.value, (id) => {
			emit('select', id ?? null)
		})
	} catch {
		sceneApi = undefined
	}
	if (!sceneApi) {
		webglOk.value = false
		return
	}
	sceneApi.setSelected(props.selectedId ?? undefined)
	if (typeof ResizeObserver !== 'undefined' && containerEl.value) {
		resizeObserver = new ResizeObserver(() => sceneApi?.resize())
		resizeObserver.observe(containerEl.value)
	}
})

watch(
	() => props.selectedId,
	(id) => {
		sceneApi?.setSelected(id ?? undefined)
	}
)

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	sceneApi?.dispose()
	sceneApi = undefined
})
</script>
<style scoped lang="scss">
.scene {
	position: relative;
	width: 100%;
	height: 640px;
	overflow: hidden;
	touch-action: none;
	user-select: none;
	border-radius: 8px;
	background: #141418;
}

.scene-canvas {
	display: block;
	width: 100%;
	height: 100%;
}

.webgl-fallback {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: #9a9ca3;
}

.device-buttons {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
}

.controls {
	position: absolute;
	top: 12px;
	right: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.hint {
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	padding: 4px 12px;
	border-radius: 999px;
	font-size: 0.75rem;
	color: #b7bac1;
	background: rgb(10 10 12 / 55%);
	pointer-events: none;
	white-space: nowrap;
}
</style>
