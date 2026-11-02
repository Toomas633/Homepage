import { CylinderGeometry, Group, Mesh, TorusGeometry } from 'three'
import { led as ledMaterial, paintedSteel, plastic } from '../materials'
import { OPENING_W, POST_T } from '../rack'
import { tag, shadows, box } from './shared'

/* ------------------------------------------------------------------ */
/* UniFi AC Pro on the right side of the rack                          */
/* ------------------------------------------------------------------ */

export function buildAcPro(): Group {
	const group = new Group()

	// wall-style bracket clamped to the outside of the front right post
	const plate = box(0.008, 0.11, 0.05, paintedSteel('#232428', 0.55))
	group.add(plate)
	const arm = box(0.045, 0.026, 0.045, paintedSteel('#6a6c75', 0.45))
	arm.position.x = 0.02
	group.add(arm)

	const disc = new Group()
	const body = new Mesh(
		new CylinderGeometry(0.0983, 0.092, 0.035, 48),
		plastic('#e9ebee', 0.38)
	)
	disc.add(body)
	const ring = new Mesh(
		new TorusGeometry(0.032, 0.004, 10, 48),
		ledMaterial('#1fc2ff')
	)
	ring.rotation.x = Math.PI / 2
	ring.position.y = 0.021
	disc.add(ring)
	const logo = new Mesh(
		new CylinderGeometry(0.012, 0.012, 0.002, 24),
		plastic('#dcdfe3', 0.35)
	)
	logo.position.y = 0.0178
	disc.add(logo)
	disc.rotation.z = -Math.PI / 2
	disc.rotation.y = 0.28
	disc.position.x = 0.045
	group.add(disc)

	group.position.set(OPENING_W / 2 + POST_T + 0.004, 0.56, -POST_T / 2)
	tag(group, 'ac-pro')
	shadows(group)
	return group
}
