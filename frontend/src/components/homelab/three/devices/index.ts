import { Group } from 'three'
import { buildAcPro } from './acPro'
import { buildAms } from './ams'
import { buildDrawer } from './drawer'
import { buildSwitch } from './networkSwitch'
import { buildPatchPanel } from './patchPanel'
import { buildPowerBar } from './powerBar'
import { buildPrinter } from './printer'
import { buildR730 } from './r730'
import { buildShelf } from './shelf'

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
