import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three'
import { paintedSteel, perforatedTexture } from '../materials'
import { OPENING_W, PANEL_W, slotY, U } from '../rack'
import { tag, shadows, box } from './shared'

/* ------------------------------------------------------------------ */
/* 1U shelf, slot 14                                                   */
/* ------------------------------------------------------------------ */

export function buildShelf(): Group {
	const group = new Group()
	const vent = perforatedTexture('#232327', '#0d0d10', 20)
	vent.repeat.set(3, 2)
	const plate = new Mesh(
		new BoxGeometry(OPENING_W - 0.004, 0.006, 0.35),
		new MeshStandardMaterial({ map: vent, metalness: 0.35, roughness: 0.65 })
	)
	plate.position.set(0, -U / 2 + 0.012, -0.175)
	group.add(plate)
	const lip = box(PANEL_W, 0.018, 0.006, paintedSteel('#26262b', 0.5))
	lip.position.set(0, -U / 2 + 0.018, 0.003)
	group.add(lip)
	group.position.set(0, slotY(14) + U / 2, 0)
	tag(group, 'shelf')
	shadows(group)
	return group
}
