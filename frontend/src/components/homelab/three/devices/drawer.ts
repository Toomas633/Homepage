import { Group, Mesh, PlaneGeometry } from 'three'
import { emissive, paintedSteel, plastic, steel } from '../materials'
import { OPENING_W, PANEL_W, slotY, U } from '../rack'
import { tag, shadows, box } from './shared'

/* ------------------------------------------------------------------ */
/* LiPo charging drawer, slot 13                                       */
/* ------------------------------------------------------------------ */

export function buildDrawer(): { group: Group; slide: Group } {
	const group = new Group()
	const slide = new Group()
	group.add(slide)

	const H = U - 0.006
	const front = box(PANEL_W, H, 0.008, paintedSteel('#26262b', 0.5))
	front.position.set(0, 0, 0.004)
	slide.add(front)
	const handle = new Group()
	const bar = box(0.14, 0.009, 0.007, steel('#8d939c', 0.3))
	bar.position.set(0, 0, 0.016)
	handle.add(bar)
	for (const side of [-1, 1]) {
		const legMesh = box(0.007, 0.007, 0.01, steel('#6d7077', 0.35))
		legMesh.position.set(side * 0.065, 0, 0.011)
		handle.add(legMesh)
	}
	slide.add(handle)

	// tray contents, visible when pulled out
	const tray = box(OPENING_W - 0.03, 0.004, 0.32, paintedSteel('#232327', 0.6))
	tray.position.set(0, -H / 2 + 0.002, -0.16)
	slide.add(tray)
	const charger = box(0.09, 0.024, 0.085, plastic('#1f5fae', 0.5))
	charger.position.set(-0.11, -H / 2 + 0.016, -0.1)
	slide.add(charger)
	const chargerScreen = new Mesh(
		new PlaneGeometry(0.05, 0.02),
		emissive('#9fd4a4', 0.5)
	)
	chargerScreen.rotation.x = -Math.PI / 2
	chargerScreen.position.set(-0.11, -H / 2 + 0.0285, -0.1)
	slide.add(chargerScreen)
	for (const x of [0.03, 0.1]) {
		const lipo = box(0.045, 0.035, 0.14, plastic('#16349b', 0.55))
		lipo.position.set(x, -H / 2 + 0.022, -0.11)
		slide.add(lipo)
	}

	group.position.set(0, slotY(13) + U / 2, 0)
	tag(group, 'lipo-drawer')
	shadows(group)
	return { group, slide }
}
