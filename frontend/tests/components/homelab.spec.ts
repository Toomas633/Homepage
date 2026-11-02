import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomelabRack from '../../src/components/homelab/HomelabRack.vue'
import { homelabComponents } from '../../src/constants/homelab'
import {
	BASE_Y,
	RACK_UNITS,
	RAILS_H,
	U,
	slotY,
} from '../../src/components/homelab/three/rack'

describe('rack geometry', () => {
	it('should place slot 1 at the bottom of the rails', () => {
		expect(slotY(1)).toBe(BASE_Y)
	})

	it('should place the top slot one unit below the rail top', () => {
		expect(slotY(RACK_UNITS)).toBeCloseTo(BASE_Y + RAILS_H - U)
	})

	it('should span 15 units of standard rack height', () => {
		expect(RAILS_H).toBeCloseTo(15 * 0.04445)
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

describe('HomelabRack.vue', () => {
	function mountRack(selectedId: string | null = null) {
		return mount(HomelabRack, { props: { selectedId } })
	}

	it('should render a selectable button for every hardware component', () => {
		const wrapper = mountRack()

		for (const component of homelabComponents) {
			const button = wrapper.find(`[aria-label="Select ${component.name}"]`)
			expect(button.exists()).toBe(true)
		}
	})

	it('should emit select when a device button is clicked', async () => {
		const wrapper = mountRack()

		await wrapper
			.find('[aria-label="Select Dell PowerEdge R730"]')
			.trigger('click')

		expect(wrapper.emitted('select')?.at(-1)).toEqual(['r730'])
	})

	it('should emit select for the printer stack components', async () => {
		const wrapper = mountRack()

		await wrapper
			.find('[aria-label="Select Bambu Lab AMS 2 Pro"]')
			.trigger('click')

		expect(wrapper.emitted('select')?.at(-1)).toEqual(['ams-2-pro'])
	})

	it('should mark the selected device button as pressed', () => {
		const wrapper = mountRack('r730')

		const button = wrapper.find('[aria-label="Select Dell PowerEdge R730"]')
		expect(button.attributes('aria-pressed')).toBe('true')
	})

	it('should fall back gracefully when WebGL is unavailable', async () => {
		const wrapper = mountRack()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.webgl-fallback').exists()).toBe(true)
	})

	it('should still expose zoom and reset controls', () => {
		const wrapper = mountRack()

		expect(wrapper.find('[aria-label="Zoom in"]').exists()).toBe(true)
		expect(wrapper.find('[aria-label="Zoom out"]').exists()).toBe(true)
		expect(wrapper.find('[aria-label="Reset view"]').exists()).toBe(true)
	})
})
