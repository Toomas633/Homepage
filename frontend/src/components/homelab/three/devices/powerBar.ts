import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
} from 'three'
import { brushedTexture, led as ledMaterial, plastic } from '../materials'
import { PANEL_W, slotY, U } from '../rack'
import { tag, shadows, box, label } from './shared'

/* ------------------------------------------------------------------ */
/* Infitronic power strip, slot 15                                     */
/* ------------------------------------------------------------------ */

export function buildPowerBar(): Group {
	const group = new Group()
	const alu = brushedTexture('#d4d6d9', '#aaacb1')
	alu.repeat.set(3, 1)
	const body = new Mesh(
		new BoxGeometry(PANEL_W, U - 0.008, 0.044),
		new MeshStandardMaterial({ map: alu, metalness: 0.6, roughness: 0.5 })
	)
	body.position.set(0, 0, -0.018)
	group.add(body)

	// 9 recessed schuko sockets
	const cupMat = plastic('#0b0b0d', 0.55)
	const rimMat = plastic('#141417', 0.5)
	for (let i = 0; i < 9; i++) {
		const x = -PANEL_W / 2 + 0.065 + i * 0.0445
		const rim = new Mesh(
			new CylinderGeometry(0.0165, 0.0165, 0.006, 24),
			rimMat
		)
		rim.rotation.x = Math.PI / 2
		rim.position.set(x, 0, 0.0035)
		group.add(rim)
		const cup = new Mesh(new CylinderGeometry(0.0125, 0.013, 0.01, 24), cupMat)
		cup.rotation.x = Math.PI / 2
		cup.position.set(x, 0, 0.0015)
		group.add(cup)
		for (const side of [-1, 1]) {
			const pin = new Mesh(
				new CylinderGeometry(0.0018, 0.0018, 0.004, 8),
				plastic('#050506', 0.4)
			)
			pin.rotation.x = Math.PI / 2
			pin.position.set(x + side * 0.0095, 0, 0.004)
			group.add(pin)
		}
	}

	// red illuminated rocker on the left
	const rocker = box(0.016, 0.012, 0.006, ledMaterial('#ff2e24'))
	rocker.position.set(-PANEL_W / 2 + 0.024, 0, 0.004)
	group.add(rocker)

	const brand = label('INFITRONIC', 0.03, 0.005, {
		fg: '#5a5c62',
		font: '20px Arial',
		width: 256,
		height: 40,
	})
	brand.position.set(-PANEL_W / 2 + 0.024, -0.013, 0.0075)
	group.add(brand)

	group.position.set(0, slotY(15) + U / 2, 0.012)
	tag(group, 'power-bar')
	shadows(group)
	return group
}
