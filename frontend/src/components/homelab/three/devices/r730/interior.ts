import { CylinderGeometry, Group, Mesh, PlaneGeometry } from 'three'
import { plastic, steel } from '../../materials'
import { box } from '../shared'

const WIRE_COLORS = ['#c9b03c', '#b03c3c', '#2456b0', '#1a1b1e']

export function buildR730Interior(
	H: number,
	DEPTH: number,
	bodyW: number
): Group {
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
