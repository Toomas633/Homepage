import {
	CylinderGeometry,
	Group,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	TorusGeometry,
} from 'three'
import {
	led as ledMaterial,
	labelTexture,
	plastic,
	steel,
} from '../../materials'
import { box, label } from '../shared'

export function buildR730ControlPanel(H: number, bodyW: number): Group {
	const panel = new Group()
	// control/IO module on the far LEFT of the 16x2.5" chassis, as on the
	// real R730: DELL mark top-left, power/ID/NMI and vFlash on top,
	// diagnostics LCD, USB and VGA ports, slim optical disk bay and
	// pull-out info tag at the bottom
	const cpW = 0.075
	const x0 = -bodyW / 2 + 0.003
	const cpX = x0 + cpW / 2
	const backing = box(cpW, H - 0.003, 0.009, plastic('#1b1c20', 0.55))
	backing.position.set(cpX, 0, -0.0005)
	panel.add(backing)

	// DELL wordmark printed top-left on the module
	const dellMark = label('DELL', 0.0135, 0.0042, {
		fg: '#c9ccd2',
		font: 'bold 56px Arial',
		width: 192,
		height: 64,
	})
	dellMark.position.set(x0 + 0.0115, H / 2 - 0.0035, 0.0062)
	panel.add(dellMark)

	// power button with LED ring, system ID button and NMI pinhole on top
	const powerRing = new Mesh(
		new TorusGeometry(0.0038, 0.0011, 8, 24),
		ledMaterial('#38d04a')
	)
	powerRing.position.set(x0 + 0.011, H / 2 - 0.011, 0.0048)
	panel.add(powerRing)
	const powerCore = new Mesh(
		new CylinderGeometry(0.003, 0.003, 0.002, 16),
		plastic('#1a1b1e', 0.5)
	)
	powerCore.rotation.x = Math.PI / 2
	powerCore.position.set(x0 + 0.011, H / 2 - 0.011, 0.0045)
	panel.add(powerCore)
	const idBtn = new Mesh(
		new CylinderGeometry(0.0026, 0.0026, 0.002, 16),
		plastic('#2456b0', 0.45)
	)
	idBtn.rotation.x = Math.PI / 2
	idBtn.position.set(x0 + 0.0255, H / 2 - 0.011, 0.0048)
	panel.add(idBtn)
	const nmi = new Mesh(
		new CylinderGeometry(0.0012, 0.0012, 0.002, 8),
		plastic('#0a0a0c', 0.7)
	)
	nmi.rotation.x = Math.PI / 2
	nmi.position.set(x0 + 0.034, H / 2 - 0.011, 0.0046)
	panel.add(nmi)

	// vFlash SD slot in the top right corner
	const vfShell = box(0.016, 0.0052, 0.003, steel('#8d939c', 0.4))
	vfShell.position.set(x0 + 0.058, H / 2 - 0.011, 0.0045)
	panel.add(vfShell)
	const vfSlot = box(0.013, 0.0022, 0.0015, plastic('#0a0a0c', 0.7))
	vfSlot.position.set(x0 + 0.058, H / 2 - 0.011, 0.006)
	panel.add(vfSlot)

	// small blue diagnostics LCD with nav buttons to its right
	const lcdBezel = box(0.03, 0.0135, 0.003, plastic('#101114', 0.4))
	lcdBezel.position.set(x0 + 0.019, H / 2 - 0.0265, 0.0045)
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
	const lcd = new Mesh(new PlaneGeometry(0.025, 0.0095), lcdMaterial)
	lcd.position.set(x0 + 0.019, H / 2 - 0.0265, 0.0062)
	panel.add(lcd)
	for (let i = 0; i < 3; i++) {
		const navBtn = box(0.0038, 0.0038, 0.0018, plastic('#3a3c42', 0.45))
		navBtn.position.set(x0 + 0.042 + i * 0.0062, H / 2 - 0.0265, 0.0052)
		panel.add(navBtn)
	}

	// USB 2.0 port and VGA D-sub on the third row
	const usbShell = box(0.0135, 0.0062, 0.003, steel('#9aa0a8', 0.4))
	usbShell.position.set(x0 + 0.012, H / 2 - 0.0425, 0.0045)
	panel.add(usbShell)
	const usbInner = box(0.011, 0.0036, 0.0015, plastic('#0a0a0c', 0.7))
	usbInner.position.set(x0 + 0.012, H / 2 - 0.0425, 0.006)
	panel.add(usbInner)
	const vgaShell = box(0.0185, 0.0095, 0.003, steel('#8d939c', 0.4))
	vgaShell.position.set(x0 + 0.043, H / 2 - 0.0425, 0.0045)
	panel.add(vgaShell)
	const vgaInner = box(0.0148, 0.0062, 0.0015, plastic('#15306e', 0.5))
	vgaInner.position.set(x0 + 0.043, H / 2 - 0.0425, 0.006)
	panel.add(vgaInner)

	// slim optical disk bay spanning the module near the bottom
	const oddBay = box(cpW - 0.008, 0.0125, 0.0035, plastic('#101114', 0.5))
	oddBay.position.set(cpX, -H / 2 + 0.0185, 0.0045)
	panel.add(oddBay)
	const oddFace = box(cpW - 0.012, 0.0095, 0.0012, plastic('#25262b', 0.55))
	oddFace.position.set(cpX, -H / 2 + 0.0185, 0.0063)
	panel.add(oddFace)
	const oddSlot = box(cpW - 0.024, 0.0014, 0.0008, plastic('#060608', 0.7))
	oddSlot.position.set(cpX - 0.004, -H / 2 + 0.0205, 0.007)
	panel.add(oddSlot)
	const oddBtn = box(0.006, 0.0025, 0.0012, plastic('#2c2d33', 0.5))
	oddBtn.position.set(x0 + cpW - 0.012, -H / 2 + 0.0165, 0.007)
	panel.add(oddBtn)

	// pull-out information tag at the very bottom
	const infoTag = box(0.021, 0.0095, 0.0045, plastic('#2f6fd6', 0.45))
	infoTag.position.set(x0 + 0.014, -H / 2 + 0.0055, 0.0055)
	panel.add(infoTag)
	const infoFace = box(0.017, 0.007, 0.001, plastic('#dde2e8', 0.6))
	infoFace.position.set(x0 + 0.014, -H / 2 + 0.0055, 0.008)
	panel.add(infoFace)
	return panel
}
