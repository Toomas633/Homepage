import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
	emissive,
	glass,
	paintedSteel,
	perforatedTexture,
	plastic,
	steel,
} from '../materials'
import { RACK_D, TOP_Y } from '../rack'
import { tag, shadows, box, label } from './shared'

/* ------------------------------------------------------------------ */
/* Bambu Lab P2S printer + AMS 2 Pro on top of the rack                */
/* ------------------------------------------------------------------ */

export function buildPrinter(): Group {
	const group = new Group()
	const W = 0.389
	const H = 0.458
	const D = 0.389

	const shell = new Mesh(
		new RoundedBoxGeometry(W, H, D, 4, 0.012),
		plastic('#3b3c42', 0.45)
	)
	shell.position.y = H / 2
	group.add(shell)

	// front glass door
	const door = new Mesh(
		new PlaneGeometry(W * 0.74, H * 0.62),
		glass('#232730', 0.5)
	)
	door.position.set(-0.02, H * 0.5, D / 2 + 0.0015)
	group.add(door)
	const doorFrame = box(W * 0.78, H * 0.66, 0.003, plastic('#4a4b52', 0.4))
	doorFrame.position.set(-0.02, H * 0.5, D / 2 - 0.0008)
	group.add(doorFrame)
	const outlineMat = plastic('#5e5f66', 0.4)
	for (const side of [-1, 1]) {
		const vertical = box(0.004, H * 0.62, 0.002, outlineMat)
		vertical.position.set(-0.02 + (side * W * 0.74) / 2, H * 0.5, D / 2 + 0.002)
		group.add(vertical)
		const horizontal = box(W * 0.74, 0.004, 0.002, outlineMat)
		horizontal.position.set(
			-0.02,
			H * 0.5 + (side * H * 0.62) / 2,
			D / 2 + 0.002
		)
		group.add(horizontal)
	}
	const doorHandle = box(0.008, 0.07, 0.008, plastic('#4a4c52', 0.4))
	doorHandle.position.set(
		-0.02 + (W * 0.74) / 2 - 0.006,
		H * 0.5,
		D / 2 + 0.006
	)
	group.add(doorHandle)

	// interior visible through the glass
	const plate = box(W * 0.6, 0.006, D * 0.55, steel('#6a6052', 0.5))
	plate.position.set(-0.02, H * 0.26, D * 0.1)
	group.add(plate)
	const gantry = box(W * 0.72, 0.016, 0.016, paintedSteel('#44454b', 0.5))
	gantry.position.set(-0.02, H * 0.74, D * 0.12)
	group.add(gantry)
	const toolhead = box(0.045, 0.055, 0.04, plastic('#2a2b30', 0.45))
	toolhead.position.set(-0.02, H * 0.7, D * 0.12)
	group.add(toolhead)
	const chamberLight = new Mesh(
		new PlaneGeometry(W * 0.5, 0.008),
		emissive('#f5e9d0', 1.1)
	)
	chamberLight.position.set(-0.02, H * 0.78, D / 2 - 0.05)
	group.add(chamberLight)

	// touch screen bottom right
	const screen = new Mesh(
		new PlaneGeometry(0.085, 0.052),
		emissive('#28527f', 1.6)
	)
	screen.position.set(W / 2 - 0.065, H * 0.12, D / 2 + 0.0015)
	group.add(screen)
	const screenUi = new Mesh(
		new PlaneGeometry(0.06, 0.006),
		emissive('#4da3ff', 1.3)
	)
	screenUi.position.set(W / 2 - 0.065, H * 0.125, D / 2 + 0.002)
	group.add(screenUi)

	const brand = label('BAMBU LAB  P2S', 0.1, 0.01, {
		fg: '#aeb3ba',
		font: 'bold 24px Arial',
		width: 512,
		height: 52,
	})
	brand.position.set(-0.02, H * 0.9, D / 2 + 0.0015)
	group.add(brand)

	// top glass
	const topGlass = new Mesh(
		new PlaneGeometry(W * 0.72, D * 0.6),
		glass('#0d0e12', 0.6)
	)
	topGlass.rotation.x = -Math.PI / 2
	topGlass.position.set(0, H + 0.0015, 0)
	group.add(topGlass)

	// side vents
	const ventTex = perforatedTexture('#2c2d31', '#101013', 12)
	for (const side of [-1, 1]) {
		const sideVent = new Mesh(
			new PlaneGeometry(0.1, 0.07),
			new MeshStandardMaterial({ map: ventTex, roughness: 0.7, metalness: 0.1 })
		)
		sideVent.rotation.y = (side * Math.PI) / 2
		sideVent.position.set(side * (W / 2 + 0.0015), H * 0.2, D * 0.1)
		group.add(sideVent)
	}

	group.position.set(0, TOP_Y + 0.002, -RACK_D / 2 + 0.02)
	tag(group, 'bambu-p2s')
	shadows(group)
	return group
}
