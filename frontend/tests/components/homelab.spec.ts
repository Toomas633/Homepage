import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomelabRack from '../../src/components/homelab/HomelabRack.vue'
import Box3D from '../../src/components/homelab/Box3D.vue'
import {
	RACK_UNITS,
	RAILS_H,
	U,
	slotTop,
} from '../../src/components/homelab/rack3d'
import { homelabComponents } from '../../src/constants/homelab'

describe('rack3d geometry', () => {
	it('should place slot 1 at the bottom of the rails', () => {
		expect(slotTop(1)).toBe(RAILS_H - U)
	})

	it('should place the top slot at the top of the rails', () => {
		expect(slotTop(RACK_UNITS)).toBe(0)
	})

	it('should account for multi-unit devices', () => {
		expect(slotTop(1, 2)).toBe(RAILS_H - 2 * U)
	})
})

describe('homelab constants', () => {
	it('should have unique component ids', () => {
		const ids = homelabComponents.map((component) => component.id)
		expect(new Set(ids).size).toBe(ids.length)
	})

	it('should have a name, type, location and specs for every component', () => {
		for (const component of homelabComponents) {
			expect(component.name).toBeTruthy()
			expect(component.type).toBeTruthy()
			expect(component.location).toBeTruthy()
			expect(component.specs.length).toBeGreaterThan(0)
			expect(Array.isArray(component.services)).toBe(true)
		}
	})

	it('should use https product links when present', () => {
		for (const component of homelabComponents) {
			if (component.link) {
				expect(component.link.href).toMatch(/^https:\/\//)
				expect(component.link.text).toBeTruthy()
			}
		}
	})
})

describe('Box3D.vue', () => {
	it('should render all six faces', () => {
		const wrapper = mount(Box3D, { props: { w: 10, h: 20, d: 30 } })

		expect(wrapper.findAll('.face')).toHaveLength(6)
	})

	it('should skip the top face when hideTop is set', () => {
		const wrapper = mount(Box3D, {
			props: { w: 10, h: 20, d: 30, hideTop: true },
		})

		expect(wrapper.findAll('.face')).toHaveLength(5)
		expect(wrapper.find('.face-top').exists()).toBe(false)
	})

	it('should size faces from the given dimensions', () => {
		const wrapper = mount(Box3D, { props: { w: 10, h: 20, d: 30 } })

		const front = wrapper.find('.face-front')
		expect(front.attributes('style')).toContain('width: 10px')
		expect(front.attributes('style')).toContain('height: 20px')
	})
})

describe('HomelabRack.vue', () => {
	function mountRack(selectedId: string | null = null) {
		return mount(HomelabRack, { props: { selectedId } })
	}

	it('should render every hardware component', () => {
		const wrapper = mountRack()

		const labels = [
			'VEVOR 15U open frame server rack',
			'Dell PowerEdge R730',
			'24 port patch panel',
			'UniFi US-8-150W switch',
			'LiPo charging drawer',
			'1U rack shelf',
			'Infitronic INSV1001 power strip',
			'Bambu Lab P2S 3D printer',
			'Bambu Lab AMS 2 Pro',
			'UniFi AC Pro access point',
		]

		for (const label of labels) {
			expect(wrapper.find(`[aria-label="${label}"]`).exists()).toBe(true)
		}
	})

	it('should render all rack unit numbers', () => {
		const wrapper = mountRack()
		const numbers = wrapper.find('.unit-numbers').text()

		for (let unit = 1; unit <= RACK_UNITS; unit++) {
			expect(numbers).toContain(String(unit))
		}
	})

	it('should emit select when a device is clicked', async () => {
		const wrapper = mountRack()

		await wrapper.find('[aria-label="Dell PowerEdge R730"]').trigger('click')

		expect(wrapper.emitted('select')?.at(-1)).toEqual(['r730'])
	})

	it('should emit select for the printer stack components', async () => {
		const wrapper = mountRack()

		await wrapper.find('[aria-label="Bambu Lab AMS 2 Pro"]').trigger('click')

		expect(wrapper.emitted('select')?.at(-1)).toEqual(['ams-2-pro'])
	})

	it('should mark the selected device and open the server', () => {
		const wrapper = mountRack('r730')

		const server = wrapper.find('.r730')
		expect(server.classes()).toContain('selected')
		expect(server.classes()).toContain('open')
	})

	it('should open the drawer when it is selected', () => {
		const wrapper = mountRack('lipo-drawer')

		expect(wrapper.find('.lipo-drawer').classes()).toContain('open')
	})

	it('should emit a null select when the background is clicked', async () => {
		const wrapper = mountRack()

		await wrapper.find('.scene').trigger('click')

		expect(wrapper.emitted('select')?.at(-1)).toEqual([null])
	})
})
