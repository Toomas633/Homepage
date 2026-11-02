import {
	CylinderGeometry,
	Group,
	LinearFilter,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PlaneGeometry,
	TorusGeometry,
} from 'three'
import {
	brushedTexture,
	caddyFaceTexture,
	led as ledMaterial,
	labelTexture,
	paintedSteel,
	plastic,
	steel,
} from '../../materials'
import { OPENING_W, PANEL_W, slotY, U } from '../../rack'
import { tag, shadows, box, label } from '../shared'
import { buildR730Bezel } from './bezel'
import { buildR730ControlPanel } from './panel'
import { buildR730Interior } from './interior'
import { buildR730Rear } from './rear'

export function buildR730(): {
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

	// 16 vertical 2.5" SFF hot-swap caddies in two groups of 8, drives on
	// the left and the control/IO module to their right
	const bayX0 = -bodyW / 2 + 0.005
	const bayAreaW = bodyW - 0.08 - 0.005
	const dividerW = 0.007
	const pitch = (bayAreaW - dividerW) / 16
	const trayW = pitch - 0.0022
	const trayH = 0.066
	const trayY = -H / 2 + 0.0035 + trayH / 2
	const trayFace = paintedSteel('#26272b', 0.6)
	const handleMat = steel('#878d95', 0.45)
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
		// Gen13 release button: black square with orange ring, as on real trays
		const releaseBtn = box(0.0048, 0.0044, 0.0016, plastic('#0c0d10', 0.5))
		releaseBtn.position.set(-trayW / 2 + 0.0045, leverH - 0.0031, 0.005)
		handle.add(releaseBtn)
		const btnRing = new Mesh(
			new TorusGeometry(0.0013, 0.00045, 8, 20),
			plastic('#b14a1e', 0.45)
		)
		btnRing.position.set(-trayW / 2 + 0.0045, leverH - 0.0031, 0.0059)
		handle.add(btnRing)
		const padlock = box(0.0014, 0.0018, 0.0008, plastic('#c8cdd2', 0.6))
		padlock.position.set(-trayW / 2 + 0.0085, leverH - 0.0031, 0.0052)
		handle.add(padlock)
		for (const sx of [-1, 1]) {
			const rail = box(0.0018, leverH, 0.004, handleMat)
			rail.position.set(sx * (trayW / 2 - 0.0014), leverH / 2, 0.0026)
			handle.add(rail)
		}
		handle.position.set(0, -trayH / 2 + 0.002, 0.0018)
		tray.add(handle)
		tray.userData.handle = handle
		// activity/status light pipes side by side below the latch bar
		let ledColor = '#00e84a'
		if (i === 6 || i === 11) ledColor = '#ffaa00'
		if (i >= 14) ledColor = '#1c221d'
		const activity = new Mesh(
			new CylinderGeometry(0.0016, 0.0016, 0.002, 8),
			ledMaterial(ledColor)
		)
		activity.rotation.x = Math.PI / 2
		activity.position.set(-trayW / 2 + 0.0035, trayH / 2 - 0.0125, 0.0052)
		tray.add(activity)
		const status = new Mesh(
			new CylinderGeometry(0.0013, 0.0013, 0.002, 8),
			ledMaterial(i >= 14 ? '#1c221d' : '#2fae38')
		)
		status.rotation.x = Math.PI / 2
		status.position.set(-trayW / 2 + 0.0078, trayH / 2 - 0.0125, 0.0052)
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

	const bezel = buildR730Bezel(H)
	slide.add(bezel)

	// mounted so the ears sit proud of the rack posts (front face z=0.02)
	group.position.set(0, slotY(1) + U, 0.021)
	tag(group, 'r730')
	shadows(group)
	return { group, slide, lid, bezel, caddies }
}
