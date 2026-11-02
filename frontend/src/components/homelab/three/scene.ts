import {
	ACESFilmicToneMapping,
	CircleGeometry,
	Clock,
	Color,
	DirectionalLight,
	Fog,
	Group,
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
	r730Open: boolean
	drawerOut: number
}

/** Smoothstep-eased sub-phase of a 0..1 master timeline. */
function phase(t: number, from: number, to: number): number {
	const x = Math.min(1, Math.max(0, (t - from) / (to - from)))
	return x * x * (3 - 2 * x)
}

function setOpacity(root: Group, opacity: number) {
	root.traverse((child) => {
		if (child instanceof Mesh) {
			const material = child.material as MeshStandardMaterial
			material.opacity = opacity
			material.transparent =
				opacity < 1 || material.userData.keepTransparent === true
		}
	})
}

const HIGHLIGHT = new Color('#c4503c')

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
				clone.emissiveIntensity = 0.08
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
	const HOME_TARGET = { x: 0, y: 0.68, z: 0 }
	camera.position.set(HOME_POS.x, HOME_POS.y, HOME_POS.z)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.target.set(HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z)
	controls.enableDamping = true
	controls.dampingFactor = 0.08
	controls.minDistance = 0.6
	controls.maxDistance = 4.5
	controls.maxPolarAngle = Math.PI * 0.53
	// limit horizontal orbit to roughly 45 degrees either side of the front
	controls.minAzimuthAngle = -Math.PI / 4
	controls.maxAzimuthAngle = Math.PI / 4
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
	const anim: AnimState = { r730Open: false, drawerOut: 0 }
	let r730T = 0
	const clock = new Clock()
	let selectedId: string | undefined
	let focusY = HOME_TARGET.y
	let focusZ = HOME_TARGET.z

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
	let drawerPos = 0

	function lerp(from: number, to: number): number {
		return from + (to - from) * 0.12
	}

	// R730 opening sequence: slide fully out, lift the lid, remove the
	// bezel, then pop the drive caddies. Runs in reverse on deselect.
	const R730_SEQUENCE_SECONDS = 3.4
	const bezelHome = devices.r730Bezel.position.clone()

	function animateR730() {
		const slideP = phase(r730T, 0, 0.36)
		const lidP = phase(r730T, 0.34, 0.6)
		const bezelP = phase(r730T, 0.56, 0.78)
		devices.r730Slide.position.z = slideP * 0.56
		devices.r730Lid.position.z = lidP * -0.24
		devices.r730Lid.position.y = lidP * 0.06
		devices.r730Lid.rotation.x = Math.sin(lidP * Math.PI) * 0.16
		devices.r730Lid.visible = lidP < 0.98
		devices.r730Bezel.position.z = bezelHome.z + bezelP * 0.1
		devices.r730Bezel.position.y = bezelHome.y - bezelP * 0.12
		devices.r730Bezel.rotation.x = bezelP * 0.35
		const bezelFade = phase(r730T, 0.68, 0.8)
		setOpacity(devices.r730Bezel, 1 - bezelFade)
		devices.r730Bezel.visible = bezelFade < 0.98
		devices.r730Caddies.forEach((tray, i) => {
			const caddyP = phase(r730T, 0.76 + i * 0.0035, 0.93 + i * 0.0035)
			tray.position.z = (tray.userData.baseZ as number) + caddyP * 0.034
			const handle = tray.userData.handle as Group
			handle.rotation.x = caddyP * 1.4
		})
	}

	function render() {
		if (disposed) return
		frame = requestAnimationFrame(render)
		const dt = Math.min(clock.getDelta(), 0.05)
		const direction = anim.r730Open ? 1 : -1
		r730T = Math.min(
			1,
			Math.max(0, r730T + (direction * dt) / R730_SEQUENCE_SECONDS)
		)
		animateR730()
		drawerPos = lerp(drawerPos, anim.drawerOut)
		devices.drawerSlide.position.z = drawerPos * 0.26
		controls.target.y += (focusY - controls.target.y) * 0.08
		controls.target.z += (focusZ - controls.target.z) * 0.08
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
			anim.r730Open = id === 'r730'
			anim.drawerOut = id === 'lipo-drawer' ? 1 : 0
			focusY = id === 'r730' ? 0.4 : HOME_TARGET.y
			focusZ = id === 'r730' ? 0.24 : HOME_TARGET.z
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
