import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PlaneGeometry,
} from 'three'
import {
	contactShadowTexture,
	labelTexture,
	paintedSteel,
	railHoleTexture,
	steel,
} from './materials'

/** Rack geometry constants (metres). */
export const U = 0.04445
export const RACK_UNITS = 15
export const RAILS_H = U * RACK_UNITS
/** y of the bottom of slot 1 */
export const BASE_Y = 0.12
/** Opening between the mounting rails */
export const OPENING_W = 0.451
/** Full 19" panel width */
export const PANEL_W = 0.4826
/** Depth between front and rear posts */
export const RACK_D = 0.55
export const POST_T = 0.04
export const TOP_Y = BASE_Y + RAILS_H + 0.045

/** y of the bottom of a slot */
export function slotY(slot: number): number {
	return BASE_Y + (slot - 1) * U
}

function post(material: MeshStandardMaterial): Mesh {
	const mesh = new Mesh(
		new BoxGeometry(POST_T, RAILS_H + 0.02, POST_T),
		material
	)
	mesh.castShadow = true
	mesh.receiveShadow = true
	return mesh
}

function frameBar(
	width: number,
	depth: number,
	material: MeshStandardMaterial
): Mesh {
	const mesh = new Mesh(new BoxGeometry(width, 0.045, depth), material)
	mesh.castShadow = true
	mesh.receiveShadow = true
	return mesh
}

function caster(wheelMaterial: MeshStandardMaterial): Group {
	const group = new Group()
	const fork = new Mesh(
		new BoxGeometry(0.03, 0.035, 0.012),
		paintedSteel('#3a3a40', 0.45)
	)
	fork.position.y = -0.0175
	fork.castShadow = true
	group.add(fork)
	const wheel = new Mesh(
		new CylinderGeometry(0.032, 0.032, 0.024, 24),
		wheelMaterial
	)
	wheel.rotation.z = Math.PI / 2
	wheel.position.y = -0.048
	wheel.castShadow = true
	group.add(wheel)
	const plate = new Mesh(
		new BoxGeometry(0.06, 0.008, 0.06),
		paintedSteel('#3a3a40', 0.45)
	)
	plate.position.y = 0.004
	group.add(plate)
	return group
}

/** VEVOR 15U open frame rack: 4 posts with square mounting holes, casters. */
export function buildRack(): Group {
	const rack = new Group()
	rack.userData.deviceId = 'rack'

	const black = paintedSteel('#232327', 0.6)
	const postX = OPENING_W / 2 + POST_T / 2
	const railsCenterY = BASE_Y + RAILS_H / 2

	const positions: Array<[number, number]> = [
		[-postX, 0],
		[postX, 0],
		[-postX, -RACK_D],
		[postX, -RACK_D],
	]
	for (const [x, z] of positions) {
		const p = post(black)
		p.position.set(x, railsCenterY, z)
		rack.add(p)
	}

	// square mounting holes on the front face of the front posts
	const holes = railHoleTexture(RACK_UNITS)
	const holeMaterial = new MeshStandardMaterial({
		map: holes,
		metalness: 0.4,
		roughness: 0.6,
	})
	for (const x of [-postX, postX]) {
		const strip = new Mesh(new PlaneGeometry(0.03, RAILS_H), holeMaterial)
		strip.position.set(x, railsCenterY, POST_T / 2 + 0.0005)
		rack.add(strip)
	}

	// top and bottom frames connecting the posts
	const frameY = [BASE_Y - 0.0225, BASE_Y + RAILS_H + 0.0225]
	for (const y of frameY) {
		for (const z of [0, -RACK_D]) {
			const bar = frameBar(OPENING_W + POST_T * 2, POST_T, black)
			bar.position.set(0, y, z)
			rack.add(bar)
		}
		for (const x of [-postX, postX]) {
			const bar = frameBar(POST_T, RACK_D - POST_T, black)
			bar.position.set(x, y, -RACK_D / 2)
			rack.add(bar)
		}
	}

	// VEVOR badge on the top front bar
	const badge = new Mesh(
		new PlaneGeometry(0.07, 0.018),
		new MeshStandardMaterial({
			map: labelTexture('VEVOR', {
				bg: '#ff6a00',
				fg: '#ffffff',
				font: 'bold 30px Arial',
				width: 160,
				height: 40,
			}),
			roughness: 0.5,
			metalness: 0.1,
		})
	)
	badge.position.set(0, BASE_Y + RAILS_H + 0.0225, POST_T / 2 + 0.001)
	rack.add(badge)

	// casters under the four corners
	const wheel = steel('#17171a', 0.35)
	const shadowTexture = contactShadowTexture()
	for (const [x, z] of positions) {
		const c = caster(wheel)
		c.position.set(x, BASE_Y - 0.04, z)
		rack.add(c)
		const contact = new Mesh(
			new PlaneGeometry(0.16, 0.16),
			new MeshBasicMaterial({
				map: shadowTexture,
				transparent: true,
				depthWrite: false,
			})
		)
		contact.rotation.x = -Math.PI / 2
		contact.position.set(x, 0.0015, z)
		rack.add(contact)
	}

	rack.traverse((child) => {
		child.userData.deviceId = 'rack'
	})
	return rack
}
