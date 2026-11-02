import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import { paintedSteel, plastic } from '../materials'
import { PANEL_W, slotY, U } from '../rack'
import { tag, shadows, box } from './shared'

/* ------------------------------------------------------------------ */
/* 24 port keystone patch panel, slot 10                               */
/* ------------------------------------------------------------------ */

export function buildPatchPanel(): Group {
	const group = new Group()
	const panel = box(PANEL_W, U - 0.004, 0.012, paintedSteel('#1d1d21', 0.55))
	group.add(panel)
	const portMat = plastic('#060608', 0.5)
	const frameMat = plastic('#45474e', 0.5)
	for (let i = 0; i < 24; i++) {
		const groupIdx = Math.floor(i / 6)
		const x =
			-PANEL_W / 2 +
			0.035 +
			groupIdx * 0.014 +
			i * ((PANEL_W - 0.11) / 24) +
			0.008
		const frame = box(0.0145, 0.0185, 0.005, frameMat)
		frame.position.set(x, 0, 0.007)
		group.add(frame)
		const jack = box(0.011, 0.013, 0.004, portMat)
		jack.position.set(x, -0.0008, 0.0095)
		group.add(jack)
	}
	// numbered label strips above each keystone group
	for (let groupIdx = 0; groupIdx < 4; groupIdx++) {
		const start = -PANEL_W / 2 + 0.035 + groupIdx * 0.014
		const span = 6 * ((PANEL_W - 0.11) / 24)
		const strip = new Mesh(
			new PlaneGeometry(span, 0.004),
			new MeshStandardMaterial({ color: '#c4c7cc', roughness: 0.7 })
		)
		strip.position.set(
			start + groupIdx * 6 * ((PANEL_W - 0.11) / 24) + span / 2 + 0.008,
			0.0145,
			0.0066
		)
		group.add(strip)
	}
	group.position.set(0, slotY(10) + U / 2, 0.006)
	tag(group, 'patch-panel')
	shadows(group)
	return group
}
