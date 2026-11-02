import {
	CylinderGeometry,
	DoubleSide,
	Group,
	LinearFilter,
	Material,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	RingGeometry,
} from 'three'
import {
	dellBadgeTexture,
	plastic,
	slotVentTexture,
	steel,
} from '../../materials'
import { PANEL_W } from '../../rack'
import { box, label } from '../shared'

export function buildR730Bezel(H: number): Group {
	// Dell 13G 2U bezel per owner's photo: thin top rail over an OPEN gap
	// where the drive latches/LEDs show through, smooth grey band with the
	// dark round Dell badge centred and a model plate, vertical-slot vent
	// grille below, dark full-height end caps with the keylock on the left
	const bezel = new Group()
	const bezW = PANEL_W - 0.004
	const bezH = H - 0.002
	const bow = 0.014
	const bezR = (bezW * bezW) / (8 * bow) + bow / 2
	const bezFrame = plastic('#84888e', 0.5)
	const arcT = (x: number): number => Math.asin(x / bezR)
	const shell = (
		x0: number,
		x1: number,
		y: number,
		h: number,
		mat: Material,
		lift = 0
	): Mesh => {
		const t0 = arcT(x0)
		const t1 = arcT(x1)
		const m = new Mesh(
			new CylinderGeometry(
				bezR + lift,
				bezR + lift,
				h,
				40,
				1,
				true,
				t0,
				t1 - t0
			),
			mat
		)
		m.position.set(0, y, bow - bezR)
		return m
	}
	const onArc = (x: number, lift: number): Group => {
		const t = arcT(x)
		const g = new Group()
		g.position.set(
			(bezR + lift) * Math.sin(t),
			0,
			bow - bezR + (bezR + lift) * Math.cos(t)
		)
		g.rotation.y = t
		bezel.add(g)
		return g
	}
	const xL = -bezW / 2
	const capW = 0.026
	const faceL = xL + capW
	const faceR = bezW / 2 - capW
	// thin top rail above the open gap that exposes drive latches and LEDs
	bezel.add(shell(faceL, faceR, bezH / 2 - 0.003, 0.006, bezFrame, 0.0008))
	// main face below the gap: smooth band on top, slot vents underneath
	const gapBottom = bezH / 2 - 0.0315
	const faceH = gapBottom + bezH / 2
	bezel.add(shell(faceL, faceR, gapBottom - faceH / 2, faceH, bezFrame))
	const ventTop = gapBottom - 0.0215
	const ventH = ventTop + bezH / 2 - 0.004
	const grilleTex = slotVentTexture('#84888e', '#15161a')
	grilleTex.minFilter = LinearFilter
	grilleTex.generateMipmaps = false
	grilleTex.repeat.set(6.5, 1)
	bezel.add(
		shell(
			faceL,
			faceR,
			ventTop - ventH / 2,
			ventH,
			new MeshStandardMaterial({
				map: grilleTex,
				metalness: 0.35,
				roughness: 0.5,
			}),
			0.0004
		)
	)
	// dark full-height end caps, keylock centred on the left one
	const capMatEnd = plastic('#2a2b2f', 0.5)
	bezel.add(shell(xL, faceL, 0, bezH - 0.004, capMatEnd, 0.0008))
	bezel.add(shell(faceR, bezW / 2, 0, bezH - 0.004, capMatEnd, 0.0008))
	const lockMount = onArc(xL + capW / 2, 0.0024)
	const keylock = new Mesh(
		new CylinderGeometry(0.0052, 0.0052, 0.0032, 16),
		steel('#9aa0a8', 0.35)
	)
	keylock.rotation.x = Math.PI / 2
	lockMount.add(keylock)
	const keySlot = box(0.0014, 0.0058, 0.0014, plastic('#0a0a0c', 0.7))
	keySlot.position.set(0, 0, 0.0018)
	lockMount.add(keySlot)
	// model plate on the smooth band, left of the badge
	const bandY = gapBottom - 0.0215 / 2
	const plateMount = onArc(-0.088, 0.0012)
	const plate = label('PowerEdge R730', 0.038, 0.0062, {
		bg: '#dfe2e5',
		fg: '#2c2d31',
		font: 'bold 44px Arial',
		width: 384,
		height: 64,
	})
	plate.position.set(0, bandY, 0.0004)
	plateMount.add(plate)
	// dark round Dell badge centred on the smooth band
	const badgeMount = onArc(0, 0.0012)
	const badge = new Mesh(
		new CylinderGeometry(0.0095, 0.0095, 0.002, 24),
		plastic('#2b2d31', 0.45)
	)
	badge.rotation.x = Math.PI / 2
	badge.position.set(0, bandY, 0)
	badgeMount.add(badge)
	const badgeFace = new Mesh(
		new PlaneGeometry(0.0175, 0.0175),
		new MeshStandardMaterial({
			map: dellBadgeTexture(),
			transparent: true,
			roughness: 0.35,
			metalness: 0.25,
		})
	)
	badgeFace.userData.keepTransparent = true
	badgeFace.position.set(0, bandY, 0.0012)
	badgeMount.add(badgeFace)
	// side returns closing the arc ends back to the chassis face
	for (const side of [-1, 1]) {
		const ret = box(0.004, bezH, 0.012, plastic('#2a2b2f', 0.5))
		ret.position.set(side * (bezW / 2 - 0.002), 0, -0.005)
		bezel.add(ret)
	}
	// curved top cap following the arc, closing the gap to the chassis
	const capMat = plastic('#84888e', 0.5)
	capMat.side = DoubleSide
	const tEdge = arcT(bezW / 2)
	const topCap = new Mesh(
		new RingGeometry(
			bezR - bow - 0.016,
			bezR + 0.0012,
			40,
			1,
			-Math.PI / 2 - tEdge,
			2 * tEdge
		),
		capMat
	)
	topCap.rotation.x = -Math.PI / 2
	topCap.position.set(0, bezH / 2 - 0.0008, bow - bezR)
	bezel.add(topCap)
	bezel.traverse((child) => {
		if (child instanceof Mesh) {
			const material = child.material as MeshStandardMaterial
			if (material.transparent) material.userData.keepTransparent = true
		}
	})
	bezel.position.set(0, 0, 0.0205)
	return bezel
}
