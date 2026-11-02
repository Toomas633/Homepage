import { CylinderGeometry, Group, Mesh } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { led as ledMaterial, glass, plastic } from '../materials'
import { RACK_D, TOP_Y } from '../rack'
import { tag, shadows, label } from './shared'

export function buildAms(): Group {
	const group = new Group()
	const W = 0.368
	const H = 0.232
	const D = 0.283

	const base = new Mesh(
		new RoundedBoxGeometry(W, H * 0.4, D, 3, 0.008),
		plastic('#eceef0', 0.4)
	)
	base.position.y = H * 0.2
	group.add(base)

	// clear lid
	const lid = new Mesh(
		new RoundedBoxGeometry(W * 0.96, H * 0.62, D * 0.94, 3, 0.012),
		glass('#dadde2', 0.28)
	)
	lid.position.y = H * 0.66
	group.add(lid)

	// 4 filament spools inside
	const spoolColors = ['#b31500', '#f2f3f5', '#2c2d31', '#c94a00']
	for (let i = 0; i < 4; i++) {
		const spool = new Group()
		const filamentMaterial = plastic(spoolColors[i], 0.55)
		filamentMaterial.envMapIntensity = 0.2
		const filament = new Mesh(
			new CylinderGeometry(0.036, 0.036, 0.05, 24),
			filamentMaterial
		)
		filament.rotation.z = Math.PI / 2
		spool.add(filament)
		for (const side of [-1, 1]) {
			const flange = new Mesh(
				new CylinderGeometry(0.042, 0.042, 0.003, 24),
				plastic('#d9dadd', 0.3)
			)
			flange.rotation.z = Math.PI / 2
			flange.position.x = side * 0.027
			spool.add(flange)
		}
		spool.position.set(-W / 2 + 0.065 + i * 0.079, H * 0.62, 0)
		group.add(spool)
	}

	const brand = label('AMS 2 PRO', 0.05, 0.007, {
		fg: '#8a8d93',
		font: 'bold 22px Arial',
		width: 256,
		height: 40,
	})
	brand.position.set(W / 2 - 0.06, H * 0.2, D / 2 + 0.0015)
	group.add(brand)
	const statusLed = new Mesh(
		new CylinderGeometry(0.005, 0.005, 0.002, 12),
		ledMaterial('#2fae38')
	)
	statusLed.rotation.x = Math.PI / 2
	statusLed.position.set(-W / 2 + 0.03, H * 0.2, D / 2 + 0.0015)
	group.add(statusLed)

	group.position.set(0, TOP_Y + 0.458 + 0.004, -RACK_D / 2)
	tag(group, 'ams-2-pro')
	shadows(group)
	return group
}
