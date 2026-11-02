import {
	CylinderGeometry,
	Group,
	LinearFilter,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
} from 'three'
import {
	led as ledMaterial,
	labelTexture,
	paintedSteel,
	perforatedTexture,
	plastic,
	steel,
} from '../../materials'
import { box } from '../shared'

/** Rear face: dual hot-swap PSUs, PCIe slot blanks and the port cluster. */
export function buildR730Rear(H: number, DEPTH: number, bodyW: number): Group {
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
