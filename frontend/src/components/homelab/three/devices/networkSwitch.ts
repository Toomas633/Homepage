import {
	BoxGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	TorusGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
	led as ledMaterial,
	paintedSteel,
	perforatedTexture,
	plastic,
	steel,
} from '../materials'
import { OPENING_W, slotY, U } from '../rack'
import { tag, shadows, box, label } from './shared'

/* ------------------------------------------------------------------ */
/* UniFi US-8-150W + mesh filler, slot 11                              */
/* ------------------------------------------------------------------ */

export function buildSwitch(): Group {
	const group = new Group()

	const SW_W = 0.274
	const SW_H = 0.043
	const SW_D = 0.14
	const bodyX = OPENING_W / 2 - SW_W / 2 - 0.012

	// white switch body on the right
	const body = new Mesh(
		new RoundedBoxGeometry(SW_W, SW_H, SW_D, 3, 0.004),
		plastic('#e9eaec', 0.35)
	)
	body.position.set(bodyX, 0, -SW_D / 2 + 0.008)
	group.add(body)

	// dark recessed port strip across the lower front, as on the real unit
	const portStrip = box(SW_W - 0.06, 0.021, 0.002, plastic('#3a3c42', 0.55))
	portStrip.position.set(bodyX, -0.004, 0.0085)
	group.add(portStrip)

	// port block: 8 RJ45 + 2 SFP
	const portMat = plastic('#0c0c0f', 0.45)
	for (let i = 0; i < 8; i++) {
		const port = box(0.0145, 0.0125, 0.005, portMat)
		port.position.set(bodyX - SW_W / 2 + 0.05 + i * 0.0185, -0.004, 0.009)
		group.add(port)
		const led = new Mesh(
			new PlaneGeometry(0.0034, 0.0034),
			ledMaterial(i < 5 ? '#00e84a' : '#13301a')
		)
		led.position.set(bodyX - SW_W / 2 + 0.05 + i * 0.0185, 0.0075, 0.0105)
		group.add(led)
	}
	for (let i = 0; i < 2; i++) {
		const sfp = box(0.015, 0.0105, 0.004, steel('#6a6e76', 0.4))
		sfp.position.set(bodyX + SW_W / 2 - 0.045 + i * 0.019, -0.004, 0.009)
		group.add(sfp)
	}
	const brand = label('UniFi Switch 8 POE-150W', 0.08, 0.007, {
		fg: '#8f939a',
		font: '22px Arial',
		width: 512,
		height: 44,
	})
	brand.position.set(bodyX - SW_W / 2 + 0.055, 0.015, 0.0105)
	group.add(brand)

	// UniFi logo mark on the right of the faceplate
	const logoRing = new Mesh(
		new TorusGeometry(0.006, 0.0012, 8, 24),
		plastic('#9aa0a8', 0.4)
	)
	logoRing.position.set(bodyX + SW_W / 2 - 0.02, 0.008, 0.0105)
	group.add(logoRing)

	// metal rack ear on the far right
	const ear = box(0.018, U - 0.006, 0.01, paintedSteel('#2a2b2f', 0.5))
	ear.position.set(OPENING_W / 2 + 0.006, 0, 0.004)
	group.add(ear)

	// 3D printed mesh filler bar on the left
	const fillerW = OPENING_W - SW_W - 0.03
	const mesh = perforatedTexture('#1b1b1f', '#060608', 14)
	mesh.repeat.set(4, 1)
	const filler = new Mesh(
		new BoxGeometry(fillerW, U - 0.006, 0.008),
		new MeshStandardMaterial({
			map: mesh,
			metalness: 0.05,
			roughness: 0.8,
		})
	)
	filler.position.set(-OPENING_W / 2 + fillerW / 2 + 0.002, 0, 0.004)
	group.add(filler)

	group.position.set(0, slotY(11) + U / 2, 0.004)
	tag(group, 'unifi-switch')
	shadows(group)
	return group
}
