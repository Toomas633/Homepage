import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import useLoadingMixin from '../../src/helpers/loadingMixin'

describe('loadingMixin', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	describe('loadingIcon initialization', () => {
		it('should initialize with first icon', () => {
			const icons = ['icon1', 'icon2', 'icon3']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('icon1')
		})

		it('should handle single icon array', () => {
			const icons = ['singleIcon']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('singleIcon')
		})

		it('should handle array with two icons', () => {
			const icons = ['iconA', 'iconB']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('iconA')
		})
	})

	describe('icon rotation', () => {
		it('should cycle through icons every 100ms', async () => {
			const icons = ['icon1', 'icon2', 'icon3']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('icon1')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('icon2')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('icon3')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('icon1')
		})

		it('should continue cycling indefinitely', async () => {
			const icons = ['A', 'B']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('A')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('B')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('A')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('B')
		})

		it('should handle single icon without errors', async () => {
			const icons = ['onlyIcon']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('onlyIcon')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('onlyIcon')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('onlyIcon')
		})

		it('should use 100ms interval consistently', () => {
			const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
			const icons = ['1', '2', '3', '4']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div></div>',
			})

			mount(component)

			expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 100)
		})
	})

	describe('cleanup', () => {
		it('should clear interval on unmount', () => {
			const icons = ['icon1', 'icon2']
			const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div></div>',
			})

			const wrapper = mount(component)
			wrapper.unmount()

			expect(clearIntervalSpy).toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle many icons', async () => {
			const icons = Array.from({ length: 10 }, (_, i) => `icon${i}`)
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('icon0')

			for (let i = 1; i < 10; i++) {
				await vi.advanceTimersByTimeAsync(100)
				await wrapper.vm.$nextTick()
				expect(wrapper.vm.loadingIcon).toBe(`icon${i}`)
			}

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('icon0')
		})

		it('should handle icons with special characters', async () => {
			const icons = ['mdi-loading', 'mdi-sync', 'mdi-refresh']
			const component = defineComponent({
				setup() {
					return useLoadingMixin(icons)
				},
				template: '<div>{{ loadingIcon }}</div>',
			})

			const wrapper = mount(component)

			expect(wrapper.vm.loadingIcon).toBe('mdi-loading')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('mdi-sync')

			await vi.advanceTimersByTimeAsync(100)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.loadingIcon).toBe('mdi-refresh')
		})
	})
})
