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
	hexMeshTexture,
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
	// black KVM/control module on the far left of the 16x2.5" chassis:
	// Dell badge + LCD + power on the top row, VGA below, two stacked
	// USB ports, hex vent grille filling the rest, blue info tag bottom
	const cpW = 0.075
	const x0 = -bodyW / 2 + 0.003
	const cpX = x0 + cpW / 2
	const backing = box(cpW, H - 0.003, 0.009, plastic('#1b1c20', 0.55))
	backing.position.set(cpX, 0, -0.0005)
	panel.add(backing)

	// round Dell badge, top left corner of the module
	const miniBadge = new Mesh(
		new PlaneGeometry(0.0115, 0.0115),
		new MeshStandardMaterial({
			map: dellBadgeTexture(),
			transparent: true,
			roughness: 0.4,
			metalness: 0.2,
		})
	)
	miniBadge.userData.keepTransparent = true
	miniBadge.position.set(x0 + 0.0105, H / 2 - 0.012, 0.0052)
	panel.add(miniBadge)

	// small blue diagnostics LCD with nav buttons to its right
	const lcdBezel = box(0.027, 0.0135, 0.003, plastic('#101114', 0.4))
	lcdBezel.position.set(x0 + 0.0335, H / 2 - 0.012, 0.0045)
	panel.add(lcdBezel)
	const lcdMaterial = new MeshBasicMaterial({
		map: labelTexture('ST 7Y2K3B2', {
			bg: '#1266e3',
			fg: '#eaf3ff',
			font: 'bold 26px Arial',
			width: 192,
			height: 56,
		}),
	})
	lcdMaterial.toneMapped = false
	const lcd = new Mesh(new PlaneGeometry(0.0225, 0.0095), lcdMaterial)
	lcd.position.set(x0 + 0.0335, H / 2 - 0.012, 0.0062)
	panel.add(lcd)
	for (let i = 0; i < 2; i++) {
		const navBtn = box(0.0038, 0.0038, 0.0018, plastic('#3a3c42', 0.45))
		navBtn.position.set(x0 + 0.051 + i * 0.0062, H / 2 - 0.012, 0.0052)
		panel.add(navBtn)
	}

	// power button with LED ring, top right of the module
	const powerRing = new Mesh(
		new TorusGeometry(0.0038, 0.0011, 8, 24),
		ledMaterial('#38d04a')
	)
	powerRing.position.set(x0 + 0.067, H / 2 - 0.012, 0.0048)
	panel.add(powerRing)
	const powerCore = new Mesh(
		new CylinderGeometry(0.003, 0.003, 0.002, 16),
		plastic('#1a1b1e', 0.5)
	)
	powerCore.rotation.x = Math.PI / 2
	powerCore.position.set(x0 + 0.067, H / 2 - 0.012, 0.0045)
	panel.add(powerCore)

	// horizontal VGA D-sub below the top row
	const vgaShell = box(0.0185, 0.0095, 0.003, steel('#8d939c', 0.4))
	vgaShell.position.set(x0 + 0.0335, H / 2 - 0.0275, 0.0045)
	panel.add(vgaShell)
	const vgaInner = box(0.0148, 0.0062, 0.0015, plastic('#15306e', 0.5))
	vgaInner.position.set(x0 + 0.0335, H / 2 - 0.0275, 0.006)
	panel.add(vgaInner)

	// system ID button and NMI pinhole right of the VGA port
	const idBtn = new Mesh(
		new CylinderGeometry(0.0026, 0.0026, 0.002, 16),
		plastic('#2456b0', 0.45)
	)
	idBtn.rotation.x = Math.PI / 2
	idBtn.position.set(x0 + 0.054, H / 2 - 0.0275, 0.0048)
	panel.add(idBtn)
	const nmi = new Mesh(
		new CylinderGeometry(0.0012, 0.0012, 0.002, 8),
		plastic('#0a0a0c', 0.7)
	)
	nmi.rotation.x = Math.PI / 2
	nmi.position.set(x0 + 0.063, H / 2 - 0.0275, 0.0046)
	panel.add(nmi)

	// two stacked horizontal USB ports on the left edge
	for (let u = 0; u < 2; u++) {
		const uy = H / 2 - 0.0275 - u * 0.0105
		const usbShell = box(0.0135, 0.0062, 0.003, steel('#9aa0a8', 0.4))
		usbShell.position.set(x0 + 0.0105, uy, 0.0045)
		panel.add(usbShell)
		const usbInner = box(0.011, 0.0036, 0.0015, plastic('#0a0a0c', 0.7))
		usbInner.position.set(x0 + 0.0105, uy, 0.006)
		panel.add(usbInner)
	}

	// hexagonal vent grille filling the lower portion of the module
	const cpGrilleTex = hexMeshTexture('#26272c', '#0b0c0f')
	cpGrilleTex.minFilter = LinearFilter
	cpGrilleTex.generateMipmaps = false
	cpGrilleTex.repeat.set(1.6, 0.8)
	const cpGrille = new Mesh(
		new PlaneGeometry(cpW - 0.009, 0.028),
		new MeshStandardMaterial({
			map: cpGrilleTex,
			metalness: 0.3,
			roughness: 0.55,
		})
	)
	cpGrille.position.set(cpX, -H / 2 + 0.0305, 0.0048)
	panel.add(cpGrille)

	// pull-out information tag (blue luggage tag) at the bottom
	const infoTag = box(0.021, 0.0095, 0.0045, plastic('#2f6fd6', 0.45))
	infoTag.position.set(x0 + 0.014, -H / 2 + 0.008, 0.0055)
	panel.add(infoTag)
	const infoFace = box(0.017, 0.007, 0.001, plastic('#dde2e8', 0.6))
	infoFace.position.set(x0 + 0.014, -H / 2 + 0.008, 0.008)
	panel.add(infoFace)
	return panel
}

function buildR730Interior(H: number, DEPTH: number, bodyW: number): Group {
	const interior = new Group()
	const zinc = steel('#7d838b', 0.58)
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

	// fan cage wall, then six hot-swap fan carriers with orange grab rings
	const cageWall = box(bodyW - 0.03, H - 0.014, 0.0025, zinc)
	cageWall.position.set(0.012, 0, -0.163)
	interior.add(cageWall)
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
		// orange grab ring on top of each carrier (R730 service touch point)
		const ring = new Mesh(
			new CylinderGeometry(0.0115, 0.0115, 0.0035, 20),
			plastic('#d4652a', 0.5)
		)
		ring.position.set(fx, H / 2 - 0.0065, -0.14)
		interior.add(ring)
		const ringHole = new Mesh(
			new CylinderGeometry(0.0075, 0.0075, 0.0037, 18),
			plastic('#0a0a0c', 0.7)
		)
		ringHole.position.set(fx, H / 2 - 0.0065, -0.14)
		interior.add(ringHole)
	}
	// blue fan-cage release latches at either end of the bank
	for (const lx of [-0.205, 0.213]) {
		const cageLatch = box(0.012, 0.004, 0.03, plastic('#2456b0', 0.45))
		cageLatch.position.set(lx, H / 2 - 0.008, -0.145)
		interior.add(cageLatch)
	}

	// motherboard
	const mobo = new Mesh(new PlaneGeometry(bodyW - 0.04, 0.34), pcbMat)
	mobo.rotation.x = -Math.PI / 2
	mobo.position.set(-0.02, -H / 2 + 0.005, -0.34)
	interior.add(mobo)

	// twin CPU heatsinks: side fins capped by the flat embossed top plate
	const finMat = steel('#aeb3ba', 0.32)
	for (const cx of [-0.095, 0.075]) {
		const base = box(0.062, 0.004, 0.092, steel('#8f949b', 0.4))
		base.position.set(cx, -H / 2 + 0.008, -0.3)
		interior.add(base)
		for (let fin = 0; fin < 10; fin++) {
			const plate = box(0.0022, 0.028, 0.092, finMat)
			plate.position.set(cx - 0.0275 + fin * 0.0061, -H / 2 + 0.024, -0.3)
			interior.add(plate)
		}
		const topPlate = box(0.062, 0.0022, 0.092, steel('#c2c7cd', 0.3))
		topPlate.position.set(cx, -H / 2 + 0.0391, -0.3)
		interior.add(topPlate)
		const topRidge = box(0.05, 0.0015, 0.012, steel('#9aa0a7', 0.4))
		topRidge.position.set(cx, -H / 2 + 0.041, -0.3)
		interior.add(topRidge)
	}

	// 24 DIMM slots in four banks flanking the CPUs, 8x8GB populated
	const slotMat = plastic('#0d0d10', 0.6)
	const dimmMat = plastic('#101114', 0.5)
	const latchMat = plastic('#d8dce1', 0.55)
	const banks = [-0.17, -0.048, 0.012, 0.13]
	const populated = new Set([
		'0:1',
		'0:3',
		'1:0',
		'1:3',
		'2:1',
		'2:4',
		'3:2',
		'3:4',
	])
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
			if (filled) {
				for (const lz of [-0.357, -0.243]) {
					const latch = box(0.0045, 0.009, 0.004, latchMat)
					latch.position.set(bx + i * 0.0068, -H / 2 + 0.012, lz)
					interior.add(latch)
				}
			}
		}
	})

	// rear PCIe risers: black bracket with vertical green PCB, blue latch
	for (const rx of [0.02, 0.14]) {
		const riser = box(0.115, H - 0.02, 0.055, plastic('#17181b', 0.6))
		riser.position.set(rx, 0, -DEPTH + 0.05)
		interior.add(riser)
		const riserPcb = box(0.105, H - 0.03, 0.0022, pcbMat)
		riserPcb.position.set(rx, 0, -DEPTH + 0.079)
		interior.add(riserPcb)
		const pcieSlot = box(0.075, 0.006, 0.004, plastic('#0d0d10', 0.6))
		pcieSlot.position.set(rx, H / 2 - 0.022, -DEPTH + 0.082)
		interior.add(pcieSlot)
		const latch = box(0.028, 0.004, 0.04, plastic('#2456b0', 0.45))
		latch.position.set(rx, H / 2 - 0.012, -DEPTH + 0.05)
		interior.add(latch)
		const cardEdge = box(0.095, 0.005, 0.004, plastic('#c9a84c', 0.4))
		cardEdge.position.set(rx, H / 2 - 0.008, -DEPTH + 0.03)
		interior.add(cardEdge)
	}

	// dual PSU cage at the rear left, bays side by side
	const psu = box(0.214, H - 0.012, 0.1, zinc)
	psu.position.set(-0.1155, 0, -DEPTH + 0.07)
	interior.add(psu)
	const psuSplit = box(0.0015, H - 0.012, 0.102, plastic('#3a3c40', 0.6))
	psuSplit.position.set(-0.1155, 0, -DEPTH + 0.07)
	interior.add(psuSplit)
	for (const hx of [-0.169, -0.062]) {
		const psuHandle = box(0.07, 0.006, 0.018, plastic('#1c1c1e', 0.55))
		psuHandle.position.set(hx, H / 2 - 0.006, -DEPTH + 0.03)
		interior.add(psuHandle)
	}

	// SAS ribbon cables from the backplane along the left wall to the board
	const sasMat = plastic('#101114', 0.7)
	for (const [ox, oy] of [
		[0, 0],
		[0.012, 0.004],
	]) {
		const run = box(0.018, 0.0035, 0.21, sasMat)
		run.position.set(-bodyW / 2 + 0.018 + ox, -H / 2 + 0.014 + oy, -0.215)
		interior.add(run)
		const drop = box(0.018, 0.028, 0.0035, sasMat)
		drop.position.set(-bodyW / 2 + 0.018 + ox, -H / 2 + 0.028 + oy, -0.115)
		interior.add(drop)
	}
	// power harness along the right wall
	const harness = box(0.014, 0.012, 0.3, plastic('#1a1b1e', 0.6))
	harness.position.set(bodyW / 2 - 0.014, -H / 2 + 0.012, -0.27)
	interior.add(harness)
	for (let i = 0; i < 4; i++) {
		const wire = box(0.0025, 0.0025, 0.3, plastic(WIRE_COLORS[i], 0.5))
		wire.position.set(bodyW / 2 - 0.021 + i * 0.0045, -H / 2 + 0.02, -0.27)
		interior.add(wire)
	}

	// PERC RAID controller on the front-left of the board
	const perc = box(0.065, 0.003, 0.16, pcbMat)
	perc.position.set(-0.185, -H / 2 + 0.024, -0.27)
	interior.add(perc)
	const percHs = box(0.035, 0.012, 0.045, steel('#3a6b4a', 0.5))
	percHs.position.set(-0.185, -H / 2 + 0.032, -0.25)
	interior.add(percHs)
	const percBattery = box(0.03, 0.008, 0.05, plastic('#111214', 0.6))
	percBattery.position.set(-0.185, -H / 2 + 0.03, -0.33)
	interior.add(percBattery)

	// chipset heatsink and CMOS battery between the CPU sockets
	const chipset = box(0.028, 0.01, 0.028, steel('#2f3136', 0.45))
	chipset.position.set(-0.01, -H / 2 + 0.011, -0.395)
	interior.add(chipset)
	const coin = new Mesh(
		new CylinderGeometry(0.01, 0.01, 0.0025, 18),
		steel('#c8cdd3', 0.3)
	)
	coin.position.set(0.05, -H / 2 + 0.0075, -0.395)
	interior.add(coin)

	// network daughter card right of the risers at the rear
	const ndc = box(0.06, 0.016, 0.07, pcbMat)
	ndc.position.set(0.08, -H / 2 + 0.014, -DEPTH + 0.115)
	interior.add(ndc)
	return interior
}

const WIRE_COLORS = ['#c9b03c', '#b03c3c', '#2456b0', '#1a1b1e']

/** Rear face: dual hot-swap PSUs, PCIe slot blanks and the port cluster. */
function buildR730Rear(H: number, DEPTH: number, bodyW: number): Group {
	const rear = new Group()
	const z = -DEPTH + 0.0025
	const plate = box(bodyW, H, 0.005, paintedSteel('#2c2d31', 0.6))
	plate.position.set(0, 0, z)
	rear.add(plate)

	// dual hot-swap PSUs side by side (left half of the chassis)
	const psuVent = perforatedTexture('#2e2f34', '#0c0d10', 40)
	psuVent.minFilter = LinearFilter
	psuVent.generateMipmaps = false
	const psuVentMat = new MeshStandardMaterial({
		map: psuVent,
		metalness: 0.4,
		roughness: 0.55,
	})
	for (let p = 0; p < 2; p++) {
		const px = -bodyW / 2 + 0.0535 + p * 0.107
		const shell = box(0.103, H - 0.014, 0.01, steel('#8f949b', 0.45))
		shell.position.set(px, 0, z - 0.004)
		rear.add(shell)
		const fan = new Mesh(
			new CylinderGeometry(0.0245, 0.0245, 0.002, 24),
			psuVentMat
		)
		fan.rotation.x = Math.PI / 2
		fan.position.set(px - 0.022, 0.003, z - 0.0095)
		rear.add(fan)
		const inlet = box(0.024, 0.017, 0.004, plastic('#0c0d10', 0.7))
		inlet.position.set(px + 0.028, 0.003, z - 0.009)
		rear.add(inlet)
		const psuHandle = box(0.05, 0.0055, 0.006, plastic('#1c1c1e', 0.55))
		psuHandle.position.set(px, -H / 2 + 0.011, z - 0.01)
		rear.add(psuHandle)
		const psuLed = new Mesh(
			new CylinderGeometry(0.0018, 0.0018, 0.002, 8),
			ledMaterial('#38d04a')
		)
		psuLed.rotation.x = Math.PI / 2
		psuLed.position.set(px + 0.044, H / 2 - 0.012, z - 0.009)
		rear.add(psuLed)
	}

	// PCIe slot blanks across the upper left (risers 1-3)
	const blankMat = new MeshStandardMaterial({
		map: psuVent,
		metalness: 0.45,
		roughness: 0.5,
	})
	for (let s = 0; s < 6; s++) {
		const blank = new Mesh(new PlaneGeometry(0.108, 0.0105), blankMat)
		blank.rotation.y = Math.PI
		const col = s % 3
		blank.position.set(
			s < 3 ? bodyW / 2 - 0.062 : bodyW / 2 - 0.178,
			H / 2 - 0.013 - col * 0.0125,
			z - 0.0065
		)
		rear.add(blank)
	}

	// bottom port cluster: iDRAC, serial, VGA, 2x USB, 4x 1GbE and ID button
	const portY = -H / 2 + 0.0135
	const idrac = box(0.0135, 0.0105, 0.006, plastic('#101114', 0.55))
	idrac.position.set(bodyW / 2 - 0.21, portY, z - 0.006)
	rear.add(idrac)
	const serial = box(0.0165, 0.008, 0.005, steel('#8d939c', 0.4))
	serial.position.set(bodyW / 2 - 0.186, portY, z - 0.006)
	rear.add(serial)
	const vga = box(0.0165, 0.0085, 0.005, plastic('#15306e', 0.5))
	vga.position.set(bodyW / 2 - 0.162, portY, z - 0.006)
	rear.add(vga)
	for (let u = 0; u < 2; u++) {
		const usb = box(0.0125, 0.0055, 0.005, steel('#9aa0a8', 0.4))
		usb.position.set(bodyW / 2 - 0.14 + u * 0.016, portY, z - 0.006)
		rear.add(usb)
	}
	for (let n = 0; n < 4; n++) {
		const nic = box(0.0135, 0.0105, 0.006, plastic('#101114', 0.55))
		nic.position.set(bodyW / 2 - 0.105 + n * 0.0175, portY, z - 0.006)
		rear.add(nic)
		const nicLed = new Mesh(
			new CylinderGeometry(0.0009, 0.0009, 0.0015, 6),
			ledMaterial(n < 2 ? '#38d04a' : '#1c221d')
		)
		nicLed.rotation.x = Math.PI / 2
		nicLed.position.set(
			bodyW / 2 - 0.1095 + n * 0.0175,
			portY + 0.0062,
			z - 0.0062
		)
		rear.add(nicLed)
	}
	const idRear = new Mesh(
		new CylinderGeometry(0.0028, 0.0028, 0.003, 12),
		plastic('#2456b0', 0.45)
	)
	idRear.rotation.x = Math.PI / 2
	idRear.position.set(bodyW / 2 - 0.03, portY, z - 0.006)
	rear.add(idRear)

	// regulatory / service-tag label stickers, lower centre of the rear face
	const whiteLabel = new Mesh(
		new PlaneGeometry(0.052, 0.016),
		new MeshStandardMaterial({
			map: labelTexture('SVC TAG: 7Y2K3B2', {
				bg: '#e8eaec',
				fg: '#232426',
				font: 'bold 22px Arial',
				width: 320,
				height: 96,
			}),
			roughness: 0.65,
		})
	)
	whiteLabel.rotation.y = Math.PI
	whiteLabel.position.set(-0.025, -H / 2 + 0.016, z - 0.0052)
	rear.add(whiteLabel)
	const blackLabel = new Mesh(
		new PlaneGeometry(0.052, 0.016),
		new MeshStandardMaterial({
			map: labelTexture('⚠ CAUTION  CE FCC', {
				bg: '#141518',
				fg: '#c6c9ce',
				font: '20px Arial',
				width: 320,
				height: 96,
			}),
			roughness: 0.65,
		})
	)
	blackLabel.rotation.y = Math.PI
	blackLabel.position.set(0.04, -H / 2 + 0.016, z - 0.0052)
	rear.add(blackLabel)
	return rear
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
	const floor = box(bodyW, 0.003, DEPTH, steel('#8a9098', 0.5))
	floor.position.set(0, -H / 2, -DEPTH / 2)
	slide.add(floor)
	for (const side of [-1, 1]) {
		const wall = box(0.003, H, DEPTH, zinc)
		wall.position.set((side * bodyW) / 2, 0, -DEPTH / 2)
		slide.add(wall)
	}
	const rear = buildR730Rear(H, DEPTH, bodyW)
	slide.add(rear)
	const topLip = box(bodyW, 0.004, 0.005, paintedSteel('#2b2c30', 0.5))
	topLip.position.set(0, H / 2 - 0.002, 0.0025)
	slide.add(topLip)

	// left control module: optical, power, LCD, VGA/USB, info tag
	slide.add(buildR730ControlPanel(H, bodyW))

	// 16 vertical 2.5" SFF hot-swap caddies in two groups of 8
	const cpEdge = -bodyW / 2 + 0.078
	const bayX0 = cpEdge + 0.002
	const bayAreaW = bodyW - 0.08 - 0.005
	const dividerW = 0.007
	const pitch = (bayAreaW - dividerW) / 16
	const trayW = pitch - 0.0022
	const trayH = 0.066
	const trayY = -H / 2 + 0.0035 + trayH / 2
	const trayFace = paintedSteel('#26272b', 0.6)
	const handleMat = paintedSteel('#2e2f34', 0.55)
	const caddyTex = caddyFaceTexture()
	caddyTex.minFilter = LinearFilter
	caddyTex.generateMipmaps = false
	const caddyMat = new MeshStandardMaterial({
		map: caddyTex,
		metalness: 0.25,
		roughness: 0.65,
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
			new PlaneGeometry(trayW - 0.0045, trayH - 0.02),
			caddyMat
		)
		ventPlate.position.set(0, -0.0045, 0.0034)
		tray.add(ventPlate)
		// release latch bar with teal button rides on the swing-out handle
		const handle = new Group()
		const leverH = trayH - 0.004
		const latchBar = box(trayW - 0.0025, 0.0062, 0.0032, handleMat)
		latchBar.position.set(0, leverH - 0.0031, 0.0032)
		handle.add(latchBar)
		const releaseBtn = box(0.0042, 0.0038, 0.0014, plastic('#2aa7b5', 0.45))
		releaseBtn.position.set(-trayW / 2 + 0.0045, leverH - 0.0031, 0.005)
		handle.add(releaseBtn)
		for (const sx of [-1, 1]) {
			const rail = box(0.0018, leverH, 0.004, handleMat)
			rail.position.set(sx * (trayW / 2 - 0.0014), leverH / 2, 0.0026)
			handle.add(rail)
		}
		handle.position.set(0, -trayH / 2 + 0.002, 0.0018)
		tray.add(handle)
		tray.userData.handle = handle
		// activity/status light pipes below the latch bar
		let ledColor = '#00e84a'
		if (i === 6 || i === 11) ledColor = '#ffaa00'
		if (i >= 14) ledColor = '#1c221d'
		const activity = new Mesh(
			new CylinderGeometry(0.0016, 0.0016, 0.002, 8),
			ledMaterial(ledColor)
		)
		activity.rotation.x = Math.PI / 2
		activity.position.set(-trayW / 2 + 0.0045, trayH / 2 - 0.0125, 0.0052)
		tray.add(activity)
		const status = new Mesh(
			new CylinderGeometry(0.0013, 0.0013, 0.002, 8),
			ledMaterial(i >= 14 ? '#1c221d' : '#2fae38')
		)
		status.rotation.x = Math.PI / 2
		status.position.set(-trayW / 2 + 0.0045, trayH / 2 - 0.0185, 0.0052)
		tray.add(status)
		const groupOffset = i < 8 ? 0 : dividerW
		tray.position.set(bayX0 + pitch / 2 + i * pitch + groupOffset, trayY, 0.001)
		tray.userData.baseZ = 0.001
		caddies.push(tray)
		slide.add(tray)
	}
	// chassis divider column between the two groups of 8 bays
	const divider = box(dividerW, trayH + 0.004, 0.008, plastic('#141519', 0.55))
	divider.position.set(bayX0 + 8 * pitch + dividerW / 2, trayY, 0.001)
	slide.add(divider)
	// black bay-number strip directly above the caddies
	const numStrip = box(bayAreaW, 0.0042, 0.004, plastic('#101114', 0.55))
	numStrip.position.set(bayX0 + bayAreaW / 2, trayY + trayH / 2 + 0.0021, 0.002)
	slide.add(numStrip)
	for (let i = 0; i < 16; i++) {
		const groupOffset = i < 8 ? 0 : dividerW
		const tick = box(0.0012, 0.0018, 0.0008, plastic('#c8cdd2', 0.6))
		tick.position.set(
			bayX0 + pitch / 2 + i * pitch + groupOffset,
			trayY + trayH / 2 + 0.0021,
			0.0045
		)
		slide.add(tick)
	}
	// galvanized info band with service/regulatory labels above the strip
	const bandH = H - 0.0035 - trayH - 0.0042
	const infoBand = box(bayAreaW, bandH, 0.0045, zinc)
	infoBand.position.set(bayX0 + bayAreaW / 2, H / 2 - bandH / 2, 0.00225)
	slide.add(infoBand)
	const labelSpecs: Array<[number, number, string]> = [
		[0.035, 0.028, '#e8eaec'],
		[0.095, 0.052, '#dfe2e5'],
		[0.17, 0.034, '#e8eaec'],
		[0.225, 0.02, '#d9822b'],
		[0.285, 0.046, '#dfe2e5'],
	]
	for (const [lx, lw, lc] of labelSpecs) {
		const lbl = box(lw, bandH - 0.0045, 0.0008, plastic(lc, 0.7))
		lbl.position.set(bayX0 + lx, H / 2 - bandH / 2, 0.005)
		slide.add(lbl)
	}
	// model name printed on the info band right side, as on the real chassis
	const chassisModel = label('PowerEdge R730', 0.056, 0.0062, {
		fg: '#1c1d20',
		font: 'bold 54px Arial',
		width: 512,
		height: 64,
	})
	const chassisModelMap = (chassisModel.material as MeshStandardMaterial).map
	if (chassisModelMap) {
		chassisModelMap.minFilter = LinearFilter
		chassisModelMap.generateMipmaps = false
	}
	chassisModel.position.set(bayX0 + bayAreaW - 0.045, H / 2 - bandH / 2, 0.0056)
	slide.add(chassisModel)

	// rack ears: cast metal with rounded caps, Dell badge on the left ear
	const earMat = paintedSteel('#26272b', 0.5)
	for (const side of [-1, 1]) {
		const ear = box(0.02, H, 0.014, earMat)
		ear.position.set(side * (PANEL_W / 2 - 0.008), 0, 0.0075)
		slide.add(ear)
		const cap = new Mesh(new CylinderGeometry(0.0072, 0.0072, H, 14), earMat)
		cap.position.set(side * (PANEL_W / 2 - 0.002), 0, 0.012)
		slide.add(cap)
		for (const sy of [H / 4, -H / 4]) {
			const screw = new Mesh(
				new CylinderGeometry(0.0035, 0.0035, 0.0015, 12),
				steel('#8d939c', 0.35)
			)
			screw.rotation.x = Math.PI / 2
			screw.position.set(side * (PANEL_W / 2 - 0.008), sy, 0.015)
			slide.add(screw)
		}
	}

	// Intel Inside badge sticker on the right rack ear
	const intelMat = new MeshBasicMaterial({
		map: labelTexture('intel', {
			bg: '#1a6db5',
			fg: '#ffffff',
			font: 'bold 44px Arial',
			width: 96,
			height: 112,
		}),
	})
	intelMat.toneMapped = false
	const intelBadge = new Mesh(new PlaneGeometry(0.0085, 0.01), intelMat)
	intelBadge.position.set(PANEL_W / 2 - 0.008, 0, 0.0152)
	slide.add(intelBadge)

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
		metalness: 0.55,
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

	// Dell 13G locking bezel: full-width hex mesh, silver top trim,
	// round Dell badge on the left end, LCD window, keylock on the right
	const bezel = new Group()
	const bezW = PANEL_W - 0.004
	const bezH = H - 0.002
	const bezFrame = plastic('#141519', 0.58)
	const bottomRail = box(bezW, 0.0075, 0.012, bezFrame)
	bottomRail.position.set(0, -(bezH / 2 - 0.00375), 0)
	bezel.add(bottomRail)
	// brushed aluminium trim strip across the top edge
	const trimMat = new MeshStandardMaterial({
		map: brushedTexture('#b7bcc2', '#999ea5'),
		metalness: 0.65,
		roughness: 0.4,
	})
	const topTrim = box(bezW, 0.0095, 0.012, trimMat)
	topTrim.position.set(0, bezH / 2 - 0.00475, 0)
	bezel.add(topTrim)
	const leftCap = box(0.034, bezH, 0.012, bezFrame)
	leftCap.position.set(-bezW / 2 + 0.017, 0, 0)
	bezel.add(leftCap)
	const rightCap = box(0.034, bezH, 0.012, bezFrame)
	rightCap.position.set(bezW / 2 - 0.017, 0, 0)
	bezel.add(rightCap)
	const grilleTex = hexMeshTexture('#34353c', '#0a0b0e')
	grilleTex.minFilter = LinearFilter
	grilleTex.generateMipmaps = false
	grilleTex.repeat.set(3, 0.7)
	const grille = new Mesh(
		new PlaneGeometry(bezW - 0.068, bezH - 0.017),
		new MeshStandardMaterial({
			map: grilleTex,
			metalness: 0.35,
			roughness: 0.52,
		})
	)
	grille.position.set(0, -0.0012, 0.0052)
	bezel.add(grille)
	const keylock = new Mesh(
		new CylinderGeometry(0.0052, 0.0052, 0.003, 16),
		steel('#9aa0a8', 0.35)
	)
	keylock.rotation.x = Math.PI / 2
	keylock.position.set(bezW / 2 - 0.017, 0, 0.0062)
	bezel.add(keylock)
	const keySlot = box(0.0014, 0.0058, 0.0015, plastic('#0a0a0c', 0.7))
	keySlot.position.set(bezW / 2 - 0.017, 0, 0.0078)
	bezel.add(keySlot)
	const badge = new Mesh(
		new CylinderGeometry(0.0115, 0.0115, 0.002, 24),
		steel('#b4b9c0', 0.3)
	)
	badge.rotation.x = Math.PI / 2
	badge.position.set(-bezW / 2 + 0.017, -0.006, 0.0062)
	bezel.add(badge)
	const badgeFace = new Mesh(
		new PlaneGeometry(0.021, 0.021),
		new MeshStandardMaterial({
			map: dellBadgeTexture(),
			transparent: true,
			roughness: 0.35,
			metalness: 0.25,
		})
	)
	badgeFace.userData.keepTransparent = true
	badgeFace.position.set(-bezW / 2 + 0.017, -0.006, 0.0074)
	bezel.add(badgeFace)
	// blue status LCD visible through a window left of centre
	const lcdWin = box(0.042, 0.018, 0.004, plastic('#101114', 0.45))
	lcdWin.position.set(-bezW / 4, 0.0015, 0.0048)
	bezel.add(lcdWin)
	const bezLcdMat = new MeshBasicMaterial({
		map: labelTexture('ST 7Y2K3B2', {
			bg: '#1266e3',
			fg: '#eaf3ff',
			font: 'bold 30px Arial',
			width: 192,
			height: 56,
		}),
	})
	bezLcdMat.toneMapped = false
	const bezLcd = new Mesh(new PlaneGeometry(0.036, 0.0138), bezLcdMat)
	bezLcd.position.set(-bezW / 4, 0.0015, 0.0072)
	bezel.add(bezLcd)
	const modelTag = label('PowerEdge R730', 0.08, 0.0085, {
		fg: '#eef1f4',
		font: 'bold 56px Arial',
		width: 512,
		height: 56,
	})
	const modelTagMap = (modelTag.material as MeshStandardMaterial).map
	if (modelTagMap) {
		modelTagMap.minFilter = LinearFilter
		modelTagMap.generateMipmaps = false
	}
	modelTag.position.set(bezW / 2 - 0.066, bezH / 2 - 0.0055, 0.0062)
	bezel.add(modelTag)
	bezel.traverse((child) => {
		if (child instanceof Mesh) {
			const material = child.material as MeshStandardMaterial
			if (material.transparent) material.userData.keepTransparent = true
		}
	})
	bezel.position.set(0, 0, 0.0205)
	slide.add(bezel)

	// mounted so the ears sit proud of the rack posts (front face z=0.02)
	group.position.set(0, slotY(1) + U, 0.021)
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
