import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	LinearFilter,
	Material,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PlaneGeometry,
	RepeatWrapping,
	TorusGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
	brushedTexture,
	caddyFaceTexture,
	dellBadgeTexture,
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
	/** R730 lid, lifted off smoothly after the slide-out */
	r730Lid: Group
	/** R730 front bezel, removed after the lid opens */
	r730Bezel: Group
	/** Drive caddies; each has userData.handle (Group) and userData.baseZ */
	r730Caddies: Group[]
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
/* Dell PowerEdge R730, slots 1-2, 16x 2.5" SFF vertical bays          */
/* ------------------------------------------------------------------ */

function buildR730ControlPanel(H: number, bodyW: number): Group {
	const panel = new Group()
	const cpW = 0.112
	const cpX = -bodyW / 2 + 0.003 + cpW / 2
	const backing = box(cpW, H - 0.003, 0.009, paintedSteel('#2b2c30', 0.5))
	backing.position.set(cpX, 0, -0.0005)
	panel.add(backing)

	// slim optical drive slot across the top of the control module
	const optical = box(0.094, 0.009, 0.002, plastic('#1b1c1f', 0.55))
	optical.position.set(cpX + 0.004, H / 2 - 0.0115, 0.0045)
	panel.add(optical)
	const opticalSlit = box(0.08, 0.0012, 0.0015, plastic('#060607', 0.8))
	opticalSlit.position.set(cpX + 0.001, H / 2 - 0.0115, 0.0056)
	panel.add(opticalSlit)
	const eject = box(0.006, 0.004, 0.0018, plastic('#45474d', 0.5))
	eject.position.set(cpX + 0.043, H / 2 - 0.0115, 0.0056)
	panel.add(eject)

	// left button column: power, ID, NMI pinhole
	const colX = -bodyW / 2 + 0.013
	const powerRing = new Mesh(
		new TorusGeometry(0.0042, 0.0012, 8, 24),
		ledMaterial('#38d04a')
	)
	powerRing.position.set(colX, 0.013, 0.0048)
	panel.add(powerRing)
	const powerCore = new Mesh(
		new CylinderGeometry(0.0034, 0.0034, 0.002, 16),
		plastic('#1a1b1e', 0.5)
	)
	powerCore.rotation.x = Math.PI / 2
	powerCore.position.set(colX, 0.013, 0.0045)
	panel.add(powerCore)
	const idBtn = new Mesh(
		new CylinderGeometry(0.003, 0.003, 0.002, 16),
		plastic('#33353a', 0.45)
	)
	idBtn.rotation.x = Math.PI / 2
	idBtn.position.set(colX, 0.0005, 0.0048)
	panel.add(idBtn)
	const nmi = new Mesh(
		new CylinderGeometry(0.0012, 0.0012, 0.002, 8),
		plastic('#0a0a0c', 0.7)
	)
	nmi.rotation.x = Math.PI / 2
	nmi.position.set(colX, -0.009, 0.0046)
	panel.add(nmi)

	// blue backlit LCD diagnostics panel with bezel and menu buttons
	const lcdBezel = box(0.064, 0.027, 0.003, plastic('#1d1e22', 0.4))
	lcdBezel.position.set(cpX + 0.008, 0.004, 0.0045)
	panel.add(lcdBezel)
	const lcdMaterial = new MeshBasicMaterial({
		map: labelTexture('PowerEdge R730', {
			bg: '#1266e3',
			fg: '#eaf3ff',
			font: 'bold 22px Arial',
			width: 256,
			height: 80,
		}),
	})
	lcdMaterial.toneMapped = false
	const lcd = new Mesh(new PlaneGeometry(0.052, 0.017), lcdMaterial)
	lcd.position.set(cpX + 0.008, 0.004, 0.0062)
	panel.add(lcd)
	for (let i = 0; i < 3; i++) {
		const menuBtn = box(0.005, 0.0032, 0.0018, plastic('#3a3c42', 0.45))
		menuBtn.position.set(cpX - 0.006 + i * 0.011, -0.0145, 0.0052)
		panel.add(menuBtn)
	}

	// bottom I/O row: VGA, dual USB, vFlash slot
	const vgaShell = box(0.0165, 0.0085, 0.003, steel('#8d939c', 0.4))
	vgaShell.position.set(cpX - 0.03, -0.0265, 0.0045)
	panel.add(vgaShell)
	const vgaInner = box(0.013, 0.0055, 0.0015, plastic('#15306e', 0.5))
	vgaInner.position.set(cpX - 0.03, -0.0265, 0.006)
	panel.add(vgaInner)
	for (let i = 0; i < 2; i++) {
		const usbShell = box(0.0125, 0.0055, 0.003, steel('#9aa0a8', 0.4))
		usbShell.position.set(cpX - 0.002 + i * 0.017, -0.0265, 0.0045)
		panel.add(usbShell)
		const usbInner = box(0.01, 0.0032, 0.0015, plastic('#0a0a0c', 0.7))
		usbInner.position.set(cpX - 0.002 + i * 0.017, -0.0265, 0.006)
		panel.add(usbInner)
		const usbTongue = box(0.009, 0.0012, 0.001, plastic('#16181c', 0.6))
		usbTongue.position.set(cpX - 0.002 + i * 0.017, -0.0255, 0.0065)
		panel.add(usbTongue)
	}
	const vflash = box(0.024, 0.0028, 0.0018, plastic('#0c0d10', 0.7))
	vflash.position.set(cpX + 0.034, -0.0265, 0.0052)
	panel.add(vflash)

	// pull-out information tag (blue luggage tag)
	const infoTag = box(0.014, 0.0135, 0.0045, plastic('#2f6fd6', 0.45))
	infoTag.position.set(cpX + 0.047, -H / 2 + 0.0115, 0.0055)
	panel.add(infoTag)
	const infoFace = box(0.011, 0.0105, 0.001, plastic('#dde2e8', 0.6))
	infoFace.position.set(cpX + 0.047, -H / 2 + 0.0115, 0.008)
	panel.add(infoFace)
	return panel
}

function buildR730Interior(H: number, DEPTH: number, bodyW: number): Group {
	const interior = new Group()
	const zinc = steel('#9299a1', 0.48)
	const pcbMat = plastic('#113318', 0.75)

	// drive block + backplane directly behind the bays
	const driveBlock = box(
		bodyW - 0.03,
		H - 0.016,
		0.098,
		plastic('#1d1e22', 0.6)
	)
	driveBlock.position.set(0.012, 0, -0.055)
	interior.add(driveBlock)
	const backplane = box(bodyW - 0.028, H - 0.014, 0.004, pcbMat)
	backplane.position.set(0.012, 0, -0.108)
	interior.add(backplane)

	// bank of six hot-swap fan modules with blue handles on top
	for (let i = 0; i < 6; i++) {
		const fx = -0.17 + i * 0.068
		const fan = box(0.054, H - 0.016, 0.04, plastic('#141518', 0.68))
		fan.position.set(fx, -0.002, -0.14)
		interior.add(fan)
		const bore = new Mesh(
			new CylinderGeometry(0.0225, 0.0225, 0.0015, 24),
			plastic('#09090b', 0.7)
		)
		bore.position.set(fx, H / 2 - 0.0085, -0.14)
		interior.add(bore)
		const hub = new Mesh(
			new CylinderGeometry(0.007, 0.007, 0.0025, 16),
			plastic('#2c2d31', 0.5)
		)
		hub.position.set(fx, H / 2 - 0.008, -0.14)
		interior.add(hub)
		const handle = box(0.03, 0.003, 0.009, plastic('#2456b0', 0.45))
		handle.position.set(fx, H / 2 - 0.0085, -0.158)
		interior.add(handle)
	}

	// motherboard
	const mobo = new Mesh(new PlaneGeometry(bodyW - 0.04, 0.34), pcbMat)
	mobo.rotation.x = -Math.PI / 2
	mobo.position.set(-0.02, -H / 2 + 0.005, -0.34)
	interior.add(mobo)

	// twin CPU heatsinks with airflow-aligned fins
	const finMat = steel('#aeb3ba', 0.32)
	for (const cx of [-0.095, 0.075]) {
		const base = box(0.062, 0.004, 0.092, steel('#8f949b', 0.4))
		base.position.set(cx, -H / 2 + 0.008, -0.3)
		interior.add(base)
		for (let fin = 0; fin < 10; fin++) {
			const plate = box(0.0022, 0.03, 0.092, finMat)
			plate.position.set(cx - 0.0275 + fin * 0.0061, -H / 2 + 0.025, -0.3)
			interior.add(plate)
		}
	}

	// 24 DIMM slots in four banks flanking the CPUs, 4x16GB populated
	const slotMat = plastic('#0d0d10', 0.6)
	const dimmMat = plastic('#15471f', 0.55)
	const banks = [-0.17, -0.048, 0.012, 0.13]
	const populated = new Set(['0:2', '1:3', '2:1', '3:2'])
	banks.forEach((bx, bankIndex) => {
		for (let i = 0; i < 6; i++) {
			const filled = populated.has(`${bankIndex}:${i}`)
			const stick = box(
				filled ? 0.004 : 0.0045,
				filled ? 0.028 : 0.006,
				0.11,
				filled ? dimmMat : slotMat
			)
			stick.position.set(
				bx + i * 0.0068,
				-H / 2 + (filled ? 0.019 : 0.008),
				-0.3
			)
			interior.add(stick)
		}
	})

	// rear PCIe riser assemblies with blue release latches and card edges
	for (const rx of [-0.1, 0.035]) {
		const riser = box(0.115, H - 0.02, 0.055, plastic('#17181b', 0.6))
		riser.position.set(rx, 0, -DEPTH + 0.05)
		interior.add(riser)
		const latch = box(0.028, 0.004, 0.04, plastic('#2456b0', 0.45))
		latch.position.set(rx, H / 2 - 0.012, -DEPTH + 0.05)
		interior.add(latch)
		const cardEdge = box(0.095, 0.005, 0.004, plastic('#c9a84c', 0.4))
		cardEdge.position.set(rx, H / 2 - 0.008, -DEPTH + 0.03)
		interior.add(cardEdge)
	}

	// dual PSU cage at the rear right
	const psu = box(0.11, H - 0.012, 0.1, zinc)
	psu.position.set(0.158, 0, -DEPTH + 0.07)
	interior.add(psu)
	const psuSplit = box(0.112, 0.0015, 0.1, plastic('#3a3c40', 0.6))
	psuSplit.position.set(0.158, 0, -DEPTH + 0.07)
	interior.add(psuSplit)
	const psuHandle = box(0.07, 0.006, 0.018, plastic('#1c1c1e', 0.55))
	psuHandle.position.set(0.158, H / 2 - 0.006, -DEPTH + 0.03)
	interior.add(psuHandle)
	return interior
}

function buildR730(): {
	group: Group
	slide: Group
	lid: Group
	bezel: Group
	caddies: Group[]
} {
	const group = new Group()
	const slide = new Group()
	group.add(slide)

	const H = 2 * U - 0.004
	const DEPTH = 0.6
	const bodyW = OPENING_W - 0.006
	const zinc = steel('#9299a1', 0.48)

	// chassis shell: galvanized zinc steel, open top (lid separate)
	const floor = box(bodyW, 0.003, DEPTH, steel('#787e86', 0.62))
	floor.position.set(0, -H / 2, -DEPTH / 2)
	slide.add(floor)
	for (const side of [-1, 1]) {
		const wall = box(0.003, H, DEPTH, zinc)
		wall.position.set((side * bodyW) / 2, 0, -DEPTH / 2)
		slide.add(wall)
	}
	const rear = box(bodyW, H, 0.01, paintedSteel('#2c2d31', 0.6))
	rear.position.set(0, 0, -DEPTH + 0.005)
	slide.add(rear)
	const topLip = box(bodyW, 0.004, 0.005, paintedSteel('#2b2c30', 0.5))
	topLip.position.set(0, H / 2 - 0.002, 0.0025)
	slide.add(topLip)

	// left control module: optical, power, LCD, VGA/USB, info tag
	slide.add(buildR730ControlPanel(H, bodyW))

	// single row of 16 vertical 2.5" SFF hot-swap caddies
	const bayX0 = -bodyW / 2 + 0.118
	const bayAreaW = bodyW - 0.118 - 0.01
	const pitch = bayAreaW / 16
	const trayW = pitch - 0.003
	const trayH = 0.068
	const trayY = -H / 2 + 0.0035 + trayH / 2
	const trayFace = paintedSteel('#3c3d44', 0.52)
	const handleMat = paintedSteel('#42444b', 0.62)
	const caddyTex = caddyFaceTexture()
	caddyTex.minFilter = LinearFilter
	caddyTex.generateMipmaps = false
	const caddyMat = new MeshStandardMaterial({
		map: caddyTex,
		metalness: 0.3,
		roughness: 0.58,
	})
	const vent = perforatedTexture('#28292d', '#0b0c0f', 80)
	vent.minFilter = LinearFilter
	vent.generateMipmaps = false
	const ventMat = new MeshStandardMaterial({
		map: vent,
		metalness: 0.35,
		roughness: 0.62,
	})
	const caddies: Group[] = []
	for (let i = 0; i < 16; i++) {
		const tray = new Group()
		const faceplate = box(trayW, trayH, 0.006, trayFace)
		tray.add(faceplate)
		const body = box(trayW - 0.002, trayH - 0.004, 0.09, trayFace)
		body.position.set(0, 0, -0.048)
		tray.add(body)
		const ventPlate = new Mesh(
			new PlaneGeometry(trayW - 0.003, trayH - 0.019),
			caddyMat
		)
		ventPlate.position.set(0, -0.0045, 0.0034)
		tray.add(ventPlate)
		// latch handle hinged at its lower edge, swings open on selection
		const handle = new Group()
		const latchBlock = box(trayW, 0.0135, 0.0075, handleMat)
		latchBlock.position.set(0, 0.0075, 0.0004)
		handle.add(latchBlock)
		const release = box(trayW - 0.006, 0.0048, 0.002, plastic('#aab2ba', 0.58))
		release.position.set(0, 0.009, 0.0048)
		handle.add(release)
		handle.position.set(0, trayH / 2 - 0.013, 0)
		tray.add(handle)
		tray.userData.handle = handle
		let ledColor = '#00e84a'
		if (i === 6 || i === 11) ledColor = '#ffaa00'
		if (i >= 14) ledColor = '#1c221d'
		const activity = new Mesh(
			new CylinderGeometry(0.0018, 0.0018, 0.002, 8),
			ledMaterial(ledColor)
		)
		activity.rotation.x = Math.PI / 2
		activity.position.set(-trayW / 2 + 0.003, trayH / 2 - 0.0145, 0.0035)
		tray.add(activity)
		const status = new Mesh(
			new CylinderGeometry(0.0014, 0.0014, 0.002, 8),
			ledMaterial(i >= 14 ? '#1c221d' : '#2fae38')
		)
		status.rotation.x = Math.PI / 2
		status.position.set(-trayW / 2 + 0.003, trayH / 2 - 0.0205, 0.0035)
		tray.add(status)
		tray.position.set(bayX0 + pitch / 2 + i * pitch, trayY, 0.001)
		tray.userData.baseZ = 0.001
		caddies.push(tray)
		slide.add(tray)
	}
	// perforated vent strip above the bay row
	const bayVent = new Mesh(
		new PlaneGeometry(bayAreaW, H - trayH - 0.011),
		ventMat
	)
	bayVent.position.set(
		bayX0 + bayAreaW / 2,
		H / 2 - (H - trayH - 0.011) / 2 - 0.0045,
		0.004
	)
	slide.add(bayVent)
	// bare-metal chassis lip between the caddy row and the vent strip
	const bayLip = box(bayAreaW, 0.0025, 0.0045, zinc)
	bayLip.position.set(
		bayX0 + bayAreaW / 2,
		trayY + trayH / 2 + 0.00125,
		0.00225
	)
	slide.add(bayLip)

	// rack ears: cast metal with rounded caps, Dell badge on the left ear
	const earMat = paintedSteel('#26272b', 0.5)
	for (const side of [-1, 1]) {
		const ear = box(0.02, H, 0.014, earMat)
		ear.position.set(side * (PANEL_W / 2 - 0.008), 0, 0.006)
		slide.add(ear)
		const cap = new Mesh(new CylinderGeometry(0.0072, 0.0072, H, 14), earMat)
		cap.position.set(side * (PANEL_W / 2 - 0.002), 0, 0.0105)
		slide.add(cap)
		for (const sy of [H / 4, -H / 4]) {
			const screw = new Mesh(
				new CylinderGeometry(0.0035, 0.0035, 0.0015, 12),
				steel('#8d939c', 0.35)
			)
			screw.rotation.x = Math.PI / 2
			screw.position.set(side * (PANEL_W / 2 - 0.008), sy, 0.0135)
			slide.add(screw)
		}
	}
	const dellBadge = new Mesh(
		new PlaneGeometry(0.013, 0.013),
		new MeshStandardMaterial({
			map: dellBadgeTexture(),
			transparent: true,
			roughness: 0.4,
			metalness: 0.2,
		})
	)
	dellBadge.userData.keepTransparent = true
	dellBadge.position.set(-(PANEL_W / 2 - 0.008), 0, 0.0142)
	slide.add(dellBadge)

	// ball-bearing slide rails: outer member fixed, inner member rides out
	const railZinc = steel('#b8bcc0', 0.38)
	for (const side of [-1, 1]) {
		const outer = box(0.006, 0.016, DEPTH - 0.04, railZinc)
		outer.position.set(side * (bodyW / 2 + 0.007), -0.006, -DEPTH / 2)
		group.add(outer)
		const inner = box(0.0045, 0.011, DEPTH - 0.06, steel('#cdd2d8', 0.32))
		inner.position.set(side * (bodyW / 2 + 0.003), -0.006, -DEPTH / 2 + 0.01)
		slide.add(inner)
	}

	// interior, visible when the lid is off
	slide.add(buildR730Interior(H, DEPTH, bodyW))

	// fixed front cover strip over the drive cage (stays when lid is off)
	const frontCover = box(bodyW, 0.0035, 0.115, zinc)
	frontCover.position.set(0, H / 2 - 0.002, -0.0575)
	slide.add(frontCover)

	// removable galvanized lid with info label and release latch
	const lid = new Group()
	const lidMat = new MeshStandardMaterial({
		map: brushedTexture('#9aa0a7', '#7d828a'),
		metalness: 0.6,
		roughness: 0.5,
	})
	const lidPlate = box(bodyW, 0.0035, DEPTH - 0.12, lidMat)
	lidPlate.position.set(0, H / 2 - 0.002, -(DEPTH - 0.12) / 2 - 0.12)
	lid.add(lidPlate)
	const latchBody = box(0.055, 0.005, 0.075, plastic('#232428', 0.5))
	latchBody.position.set(0.06, H / 2 + 0.0015, -0.2)
	lid.add(latchBody)
	const latchDial = new Mesh(
		new CylinderGeometry(0.013, 0.013, 0.004, 20),
		plastic('#2c2d31', 0.45)
	)
	latchDial.position.set(0.06, H / 2 + 0.003, -0.2)
	lid.add(latchDial)
	slide.add(lid)

	// Dell locking front bezel: black frame, perforated grille, keylock, badge
	const bezel = new Group()
	const bezW = PANEL_W - 0.004
	const bezH = H - 0.002
	const bezFrame = plastic('#16171b', 0.55)
	for (const sy of [1, -1]) {
		const rail = box(bezW, 0.0085, 0.012, bezFrame)
		rail.position.set(0, sy * (bezH / 2 - 0.00425), 0)
		bezel.add(rail)
	}
	const leftCap = box(0.062, bezH, 0.012, bezFrame)
	leftCap.position.set(-bezW / 2 + 0.031, 0, 0)
	bezel.add(leftCap)
	const rightCap = box(0.02, bezH, 0.012, bezFrame)
	rightCap.position.set(bezW / 2 - 0.01, 0, 0)
	bezel.add(rightCap)
	const grilleTex = perforatedTexture('#34353c', '#0b0c10', 26)
	grilleTex.minFilter = LinearFilter
	grilleTex.generateMipmaps = false
	grilleTex.wrapS = RepeatWrapping
	grilleTex.wrapT = RepeatWrapping
	grilleTex.repeat.set(5, 2)
	const grille = new Mesh(
		new PlaneGeometry(bezW - 0.088, bezH - 0.016),
		new MeshStandardMaterial({
			map: grilleTex,
			metalness: 0.35,
			roughness: 0.52,
		})
	)
	grille.position.set(0.003, 0, 0.0052)
	bezel.add(grille)
	const keylock = new Mesh(
		new CylinderGeometry(0.0045, 0.0045, 0.003, 16),
		steel('#9aa0a8', 0.35)
	)
	keylock.rotation.x = Math.PI / 2
	keylock.position.set(-bezW / 2 + 0.031, -0.014, 0.0062)
	bezel.add(keylock)
	const keySlot = box(0.0012, 0.005, 0.0015, plastic('#0a0a0c', 0.7))
	keySlot.position.set(-bezW / 2 + 0.031, -0.014, 0.0078)
	bezel.add(keySlot)
	const badge = new Mesh(
		new CylinderGeometry(0.011, 0.011, 0.002, 24),
		steel('#b4b9c0', 0.3)
	)
	badge.rotation.x = Math.PI / 2
	badge.position.set(-bezW / 2 + 0.031, 0.012, 0.0062)
	bezel.add(badge)
	const badgeFace = new Mesh(
		new PlaneGeometry(0.02, 0.02),
		new MeshStandardMaterial({
			map: dellBadgeTexture(),
			transparent: true,
			roughness: 0.35,
			metalness: 0.25,
		})
	)
	badgeFace.userData.keepTransparent = true
	badgeFace.position.set(-bezW / 2 + 0.031, 0.012, 0.0074)
	bezel.add(badgeFace)
	const modelPlate = box(0.044, 0.008, 0.0015, steel('#b4b9c0', 0.35))
	modelPlate.position.set(bezW / 2 - 0.052, -bezH / 2 + 0.0105, 0.0062)
	bezel.add(modelPlate)
	const modelTag = label('PowerEdge R730', 0.04, 0.0055, {
		fg: '#1c1d21',
		font: 'bold 28px Arial',
		width: 512,
		height: 72,
	})
	modelTag.position.set(bezW / 2 - 0.052, -bezH / 2 + 0.0105, 0.0072)
	bezel.add(modelTag)
	bezel.traverse((child) => {
		if (child instanceof Mesh) {
			const material = child.material as MeshStandardMaterial
			if (material.transparent) material.userData.keepTransparent = true
		}
	})
	bezel.position.set(0, 0, 0.0205)
	slide.add(bezel)

	group.position.set(0, slotY(1) + U, 0.004)
	tag(group, 'r730')
	shadows(group)
	return { group, slide, lid, bezel, caddies }
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

/* ------------------------------------------------------------------ */
/* UniFi AC Pro on the right side of the rack                          */
/* ------------------------------------------------------------------ */

function buildAcPro(): Group {
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
		r730Bezel: r730.bezel,
		r730Caddies: r730.caddies,
		drawerSlide: drawer.slide,
	}
}
