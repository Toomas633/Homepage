import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	Material,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	TorusGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
	brushedTexture,
	emissive,
	led as ledMaterial,
	glass,
	labelTexture,
	paintedSteel,
	perforatedTexture,
	plastic,
	steel,
} from './materials'
import { OPENING_W, PANEL_W, POST_T, RACK_D, slotY, TOP_Y, U } from './rack'

export interface DeviceHandles {
	group: Group
	/** Group that slides forward when the R730 is selected */
	r730Slide: Group
	/** R730 lid, hidden/slid back when selected */
	r730Lid: Group
	/** Group that slides forward when the drawer is selected */
	drawerSlide: Group
}

function tag(group: Group, id: string) {
	group.userData.deviceId = id
	group.traverse((child) => {
		child.userData.deviceId = id
	})
}

function shadows(group: Group) {
	group.traverse((child) => {
		if (child instanceof Mesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

function box(w: number, h: number, d: number, material: Material): Mesh {
	return new Mesh(new BoxGeometry(w, h, d), material)
}

function label(
	text: string,
	w: number,
	h: number,
	options: Parameters<typeof labelTexture>[1] = {}
): Mesh {
	const mesh = new Mesh(
		new PlaneGeometry(w, h),
		new MeshStandardMaterial({
			map: labelTexture(text, options),
			transparent: true,
			roughness: 0.6,
			metalness: 0,
		})
	)
	return mesh
}

/* ------------------------------------------------------------------ */
/* Dell PowerEdge R730, slots 1-2, 16 SFF bays                         */
/* ------------------------------------------------------------------ */

function buildR730(): { group: Group; slide: Group; lid: Group } {
	const group = new Group()
	const slide = new Group()
	group.add(slide)

	const H = 2 * U - 0.004
	const DEPTH = 0.6
	const bodyW = OPENING_W - 0.006
	const body = paintedSteel('#2e2f33', 0.55)

	// chassis shell (open top, lid separate)
	const floor = box(bodyW, 0.003, DEPTH, body)
	floor.position.set(0, -H / 2, -DEPTH / 2)
	slide.add(floor)
	for (const side of [-1, 1]) {
		const wall = box(0.003, H, DEPTH, body)
		wall.position.set((side * bodyW) / 2, 0, -DEPTH / 2)
		slide.add(wall)
	}
	const rear = box(bodyW, H, 0.01, paintedSteel('#232428', 0.6))
	rear.position.set(0, 0, -DEPTH + 0.005)
	slide.add(rear)

	// front drive cage: 2 rows x 8 SFF trays
	const trayW = 0.0504
	const trayH = H / 2 - 0.004
	const trayFace = paintedSteel('#303136', 0.5)
	const handleMat = steel('#8d939c', 0.35)
	const vent = perforatedTexture('#26272b', '#0a0a0c', 10)
	const ventMat = new MeshStandardMaterial({
		map: vent,
		metalness: 0.4,
		roughness: 0.6,
	})
	for (let row = 0; row < 2; row++) {
		for (let col = 0; col < 8; col++) {
			const tray = new Group()
			const faceplate = box(trayW - 0.002, trayH - 0.002, 0.008, trayFace)
			tray.add(faceplate)
			const ventPlate = new Mesh(
				new PlaneGeometry(trayW - 0.012, trayH - 0.014),
				ventMat
			)
			ventPlate.position.set(0.002, -0.003, 0.0045)
			tray.add(ventPlate)
			const handle = box(trayW - 0.006, 0.0048, 0.0045, handleMat)
			handle.position.set(0, trayH / 2 - 0.005, 0.004)
			tray.add(handle)
			const latch = box(0.008, 0.0035, 0.005, plastic('#b8bdc4', 0.4))
			latch.position.set(-trayW / 2 + 0.007, trayH / 2 - 0.005, 0.0042)
			tray.add(latch)
			const index = row * 8 + col
			let ledColor = '#00e84a'
			if ([0, 2, 5, 9, 12].includes(index)) ledColor = '#ffaa00'
			if (index % 5 === 3) ledColor = '#1c221d'
			const led = new Mesh(
				new CylinderGeometry(0.0016, 0.0016, 0.002, 8),
				ledMaterial(ledColor)
			)
			led.rotation.x = Math.PI / 2
			led.position.set(-trayW / 2 + 0.004, 0.008, 0.0045)
			tray.add(led)
			tray.position.set(
				-bodyW / 2 + 0.024 + col * (trayW + 0.0016),
				-H / 2 + trayH / 2 + 0.003 + row * (trayH + 0.003),
				-0.004
			)
			slide.add(tray)
		}
	}

	// rack ears with control panel
	const earMat = paintedSteel('#26272b', 0.5)
	for (const side of [-1, 1]) {
		const ear = box(0.016, H, 0.012, earMat)
		ear.position.set(side * (PANEL_W / 2 - 0.008), 0, 0.002)
		slide.add(ear)
	}
	const powerBtn = new Mesh(
		new CylinderGeometry(0.004, 0.004, 0.003, 16),
		ledMaterial('#2fae38')
	)
	powerBtn.rotation.x = Math.PI / 2
	powerBtn.position.set(-(PANEL_W / 2 - 0.008), H / 4, 0.0095)
	slide.add(powerBtn)

	// front badge
	const badge = label('DELL', 0.02, 0.008, {
		fg: '#dfe3e8',
		font: 'bold 26px Arial',
		width: 128,
		height: 48,
	})
	badge.position.set(PANEL_W / 2 - 0.008, -H / 4, 0.0085)
	slide.add(badge)

	// interior, visible when the lid is off
	const interior = new Group()
	const pcb = new Mesh(
		new PlaneGeometry(bodyW - 0.02, DEPTH * 0.55),
		plastic('#0f3d1e', 0.8)
	)
	pcb.rotation.x = -Math.PI / 2
	pcb.position.set(0, -H / 2 + 0.006, -DEPTH * 0.6)
	interior.add(pcb)
	for (const x of [-0.07, 0.07]) {
		const heatsink = box(0.06, 0.028, 0.06, steel('#9aa0a8', 0.35))
		heatsink.position.set(x, -H / 2 + 0.02, -DEPTH * 0.62)
		interior.add(heatsink)
		for (let fin = 0; fin < 5; fin++) {
			const gap = box(0.062, 0.002, 0.004, paintedSteel('#56585e', 0.4))
			gap.position.set(x, -H / 2 + 0.032, -DEPTH * 0.62 - 0.024 + fin * 0.012)
			interior.add(gap)
		}
	}
	const ramMat = plastic('#1a6b2f', 0.6)
	for (let i = 0; i < 8; i++) {
		const stick = box(0.003, 0.02, 0.1, ramMat)
		stick.position.set(-0.15 + i * 0.009, -H / 2 + 0.014, -DEPTH * 0.62)
		interior.add(stick)
	}
	const fanMat = plastic('#17171a', 0.7)
	for (let i = 0; i < 6; i++) {
		const fan = new Mesh(new CylinderGeometry(0.018, 0.018, 0.03, 16), fanMat)
		fan.rotation.x = Math.PI / 2
		fan.position.set(-0.17 + i * 0.068, -H / 2 + 0.022, -DEPTH * 0.38)
		interior.add(fan)
	}
	slide.add(interior)

	// removable lid
	const lid = new Group()
	const lidPlate = box(
		bodyW,
		0.0035,
		DEPTH - 0.09,
		paintedSteel('#3a3b40', 0.45)
	)
	lidPlate.position.set(0, H / 2 - 0.002, -(DEPTH - 0.09) / 2 - 0.09)
	lid.add(lidPlate)
	const serviceTag = new Mesh(
		new PlaneGeometry(0.12, 0.07),
		new MeshStandardMaterial({ color: '#a8abb0', roughness: 0.75 })
	)
	serviceTag.rotation.x = -Math.PI / 2
	serviceTag.position.set(-0.08, H / 2, -DEPTH * 0.5)
	lid.add(serviceTag)
	const latchBox = box(0.05, 0.004, 0.07, paintedSteel('#45474d', 0.45))
	latchBox.position.set(0.07, H / 2, -DEPTH * 0.3)
	lid.add(latchBox)
	slide.add(lid)

	group.position.set(0, slotY(1) + U, 0.004)
	tag(group, 'r730')
	shadows(group)
	return { group, slide, lid }
}

/* ------------------------------------------------------------------ */
/* 24 port keystone patch panel, slot 10                               */
/* ------------------------------------------------------------------ */

function buildPatchPanel(): Group {
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

/* ------------------------------------------------------------------ */
/* UniFi US-8-150W + mesh filler, slot 11                              */
/* ------------------------------------------------------------------ */

function buildSwitch(): Group {
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
	const portStrip = box(SW_W - 0.06, 0.021, 0.002, plastic('#141518', 0.55))
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

/* ------------------------------------------------------------------ */
/* LiPo charging drawer, slot 13                                       */
/* ------------------------------------------------------------------ */

function buildDrawer(): { group: Group; slide: Group } {
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

/* ------------------------------------------------------------------ */
/* 1U shelf, slot 14                                                   */
/* ------------------------------------------------------------------ */

function buildShelf(): Group {
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

/* ------------------------------------------------------------------ */
/* Infitronic power strip, slot 15                                     */
/* ------------------------------------------------------------------ */

function buildPowerBar(): Group {
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

/* ------------------------------------------------------------------ */
/* Bambu Lab P2S printer + AMS 2 Pro on top of the rack                */
/* ------------------------------------------------------------------ */

function buildPrinter(): Group {
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

function buildAms(): Group {
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
	const spoolColors = ['#b31500', '#f2f3f5', '#2c2d31', '#e85d00']
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
		new CylinderGeometry(0.0025, 0.0025, 0.002, 12),
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

/* ------------------------------------------------------------------ */
/* UniFi AC Pro on the right side of the rack                          */
/* ------------------------------------------------------------------ */

function buildAcPro(): Group {
	const group = new Group()

	// wall-style bracket clamped to the outside of the front right post
	const plate = box(0.008, 0.11, 0.05, paintedSteel('#232428', 0.55))
	group.add(plate)
	const arm = box(0.045, 0.026, 0.045, paintedSteel('#4a4b52', 0.45))
	arm.position.x = 0.02
	group.add(arm)

	const disc = new Group()
	const body = new Mesh(
		new CylinderGeometry(0.0983, 0.092, 0.035, 48),
		plastic('#e9ebee', 0.38)
	)
	disc.add(body)
	const ring = new Mesh(
		new TorusGeometry(0.032, 0.0028, 10, 48),
		ledMaterial('#1fc2ff')
	)
	ring.rotation.x = Math.PI / 2
	ring.position.y = 0.0178
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

/* ------------------------------------------------------------------ */

export function buildDevices(): DeviceHandles {
	const group = new Group()

	const r730 = buildR730()
	group.add(r730.group)
	group.add(buildPatchPanel())
	group.add(buildSwitch())
	const drawer = buildDrawer()
	group.add(drawer.group)
	group.add(buildShelf())
	group.add(buildPowerBar())
	group.add(buildPrinter())
	group.add(buildAms())
	group.add(buildAcPro())

	return {
		group,
		r730Slide: r730.slide,
		r730Lid: r730.lid,
		drawerSlide: drawer.slide,
	}
}
