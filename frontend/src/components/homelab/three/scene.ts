import {
	ACESFilmicToneMapping,
	CircleGeometry,
	Color,
	DirectionalLight,
	Fog,
	HemisphereLight,
	Mesh,
	MeshStandardMaterial,
	PCFShadowMap,
	PerspectiveCamera,
	PMREMGenerator,
	Raycaster,
	Scene,
	Vector2,
	WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildDevices, type DeviceHandles } from './devices'
import { buildRack } from './rack'

export interface HomelabScene {
	setSelected(id: string | undefined): void
	resetView(): void
	zoomBy(factor: number): void
	resize(): void
	dispose(): void
}

interface AnimState {
	r730Out: number
	lidOff: number
	drawerOut: number
}

const HIGHLIGHT = new Color('#7a1f1f')

function applyHighlight(
	handles: DeviceHandles,
	rack: Mesh | null,
	id?: string
) {
	const roots = [handles.group]
	for (const root of roots) {
		root.traverse((child) => {
			if (!(child instanceof Mesh)) return
			const material = child.material as MeshStandardMaterial
			if (!material?.emissive) return
			if (child.userData.baseEmissive === undefined) {
				child.userData.baseEmissive = material.emissive.getHex()
				child.userData.baseIntensity = material.emissiveIntensity
			}
			const selected = id !== undefined && child.userData.deviceId === id
			if (selected && child.userData.highlightMaterial === undefined) {
				child.userData.sharedMaterial = material
				const clone = material.clone()
				clone.emissive = HIGHLIGHT.clone()
				clone.emissiveIntensity = Math.max(0.45, clone.emissiveIntensity ?? 0)
				child.userData.highlightMaterial = clone
			}
			if (selected) {
				child.material = child.userData.highlightMaterial
			} else if (child.userData.sharedMaterial) {
				child.material = child.userData.sharedMaterial
			}
		})
	}
	void rack
}

export function createHomelabScene(
	canvas: HTMLCanvasElement,
	onSelect: (id: string | undefined) => void
): HomelabScene | undefined {
	let renderer: WebGLRenderer
	try {
		renderer = new WebGLRenderer({ canvas, antialias: true })
	} catch {
		return undefined
	}
	const container = canvas.parentElement as HTMLElement
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = PCFShadowMap
	renderer.toneMapping = ACESFilmicToneMapping
	renderer.toneMappingExposure = 1.05
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	const scene = new Scene()
	scene.background = new Color('#17171c')
	scene.fog = new Fog('#17171c', 3.2, 8)

	const pmrem = new PMREMGenerator(renderer)
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
	scene.environmentIntensity = 0.45

	const camera = new PerspectiveCamera(42, 1, 0.05, 30)
	const HOME_POS = { x: 0.32, y: 1.05, z: 1.98 }
	const HOME_TARGET = { x: 0, y: 0.72, z: 0 }
	camera.position.set(HOME_POS.x, HOME_POS.y, HOME_POS.z)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.target.set(HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z)
	controls.enableDamping = true
	controls.dampingFactor = 0.08
	controls.minDistance = 0.6
	controls.maxDistance = 4.5
	controls.maxPolarAngle = Math.PI * 0.53
	controls.update()

	// lighting
	const hemi = new HemisphereLight('#cfd3dc', '#1a1a1e', 0.45)
	scene.add(hemi)
	const key = new DirectionalLight('#fff3e2', 2.4)
	key.position.set(1.2, 3, 2.8)
	key.castShadow = true
	key.shadow.mapSize.set(2048, 2048)
	key.shadow.camera.near = 0.5
	key.shadow.camera.far = 12
	key.shadow.camera.left = -2.5
	key.shadow.camera.right = 2.5
	key.shadow.camera.top = 3
	key.shadow.camera.bottom = -1
	key.shadow.radius = 5
	key.shadow.bias = -0.0004
	scene.add(key)
	const fill = new DirectionalLight('#aebadc', 0.6)
	fill.position.set(-2, 1.4, 1.2)
	scene.add(fill)

	// floor
	const floor = new Mesh(
		new CircleGeometry(4, 48),
		new MeshStandardMaterial({
			color: '#151518',
			roughness: 0.92,
			metalness: 0.05,
		})
	)
	floor.rotation.x = -Math.PI / 2
	floor.receiveShadow = true
	scene.add(floor)

	const rack = buildRack()
	scene.add(rack)
	const devices = buildDevices()
	scene.add(devices.group)

	// selection animation state
	const anim: AnimState = { r730Out: 0, lidOff: 0, drawerOut: 0 }
	const target: AnimState = { r730Out: 0, lidOff: 0, drawerOut: 0 }
	let selectedId: string | undefined

	const raycaster = new Raycaster()
	const pointer = new Vector2()
	let downX = 0
	let downY = 0

	function onPointerDown(event: PointerEvent) {
		downX = event.clientX
		downY = event.clientY
	}

	function onPointerUp(event: PointerEvent) {
		if (
			Math.abs(event.clientX - downX) > 5 ||
			Math.abs(event.clientY - downY) > 5
		) {
			return
		}
		const bounds = renderer.domElement.getBoundingClientRect()
		pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
		pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const hits = raycaster.intersectObjects([devices.group, rack], true)
		const hit = hits.find((h) => h.object.userData.deviceId)
		onSelect(hit?.object.userData.deviceId)
	}

	renderer.domElement.addEventListener('pointerdown', onPointerDown)
	renderer.domElement.addEventListener('pointerup', onPointerUp)

	let disposed = false
	let frame = 0

	function lerp(from: number, to: number): number {
		return from + (to - from) * 0.12
	}

	function render() {
		if (disposed) return
		frame = requestAnimationFrame(render)
		anim.r730Out = lerp(anim.r730Out, target.r730Out)
		anim.lidOff = lerp(anim.lidOff, target.lidOff)
		anim.drawerOut = lerp(anim.drawerOut, target.drawerOut)
		devices.r730Slide.position.z = anim.r730Out * 0.34
		devices.r730Lid.position.z = anim.lidOff * -0.22
		devices.r730Lid.position.y = anim.lidOff * 0.05
		devices.r730Lid.visible = anim.lidOff < 0.98
		devices.drawerSlide.position.z = anim.drawerOut * 0.26
		controls.update()
		renderer.render(scene, camera)
	}

	function resize() {
		const width = container?.clientWidth || canvas.clientWidth || 800
		const height = container?.clientHeight || canvas.clientHeight || 600
		renderer.setSize(width, height, false)
		camera.aspect = width / height
		camera.updateProjectionMatrix()
	}

	resize()
	render()

	return {
		setSelected(id: string | undefined) {
			selectedId = id
			target.r730Out = id === 'r730' ? 1 : 0
			target.lidOff = id === 'r730' ? 1 : 0
			target.drawerOut = id === 'lipo-drawer' ? 1 : 0
			applyHighlight(devices, null, selectedId)
		},
		resetView() {
			camera.position.set(HOME_POS.x, HOME_POS.y, HOME_POS.z)
			controls.target.set(HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z)
			controls.update()
		},
		zoomBy(factor: number) {
			const direction = camera.position.clone().sub(controls.target)
			const length = Math.min(
				Math.max(direction.length() * factor, controls.minDistance),
				controls.maxDistance
			)
			camera.position
				.copy(controls.target)
				.add(direction.normalize().multiplyScalar(length))
			controls.update()
		},
		resize,
		dispose() {
			disposed = true
			cancelAnimationFrame(frame)
			renderer.domElement.removeEventListener('pointerdown', onPointerDown)
			renderer.domElement.removeEventListener('pointerup', onPointerUp)
			controls.dispose()
			pmrem.dispose()
			renderer.dispose()
		},
	}
}
