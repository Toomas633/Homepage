import { describe, it, expect, vi } from 'vitest'
import { defineComponent, getCurrentInstance, App } from 'vue'
import { mount } from '@vue/test-utils'
import useCookies from '../../src/helpers/useCookies'

describe('useCookies', () => {
	const mockCookies = {
		get: vi.fn(),
		set: vi.fn(),
		remove: vi.fn(),
		isKey: vi.fn(),
	}

	const cookiesPlugin = {
		install: (app: App) => {
			app.config.globalProperties.$cookies = mockCookies
		},
	}

	describe('within component setup', () => {
		it('should return cookies instance from component context', () => {
			const TestComponent = defineComponent({
				setup() {
					const cookies = useCookies()
					return { cookies }
				},
				template: '<div>Test</div>',
			})

			const wrapper = mount(TestComponent, {
				global: {
					plugins: [cookiesPlugin],
				},
			})

			expect(wrapper.vm.cookies).toBeDefined()
			expect(wrapper.vm.cookies).toBe(mockCookies)
		})

		it('should provide access to cookie methods', () => {
			const TestComponent = defineComponent({
				setup() {
					const cookies = useCookies()
					return { cookies }
				},
				template: '<div>Test</div>',
			})

			const wrapper = mount(TestComponent, {
				global: {
					plugins: [cookiesPlugin],
				},
			})

			expect(wrapper.vm.cookies.get).toBeDefined()
			expect(wrapper.vm.cookies.set).toBeDefined()
			expect(wrapper.vm.cookies.remove).toBeDefined()
		})

		it('should return same instance as global $cookies', () => {
			const TestComponent = defineComponent({
				setup() {
					const cookies = useCookies()
					const instance = getCurrentInstance()
					const globalCookies =
						instance?.appContext.config.globalProperties.$cookies
					return { cookies, globalCookies }
				},
				template: '<div>Test</div>',
			})

			const wrapper = mount(TestComponent, {
				global: {
					plugins: [cookiesPlugin],
				},
			})

			expect(wrapper.vm.cookies).toBe(wrapper.vm.globalCookies)
		})
	})

	describe('error handling', () => {
		it('should throw error when called outside setup function', () => {
			expect(() => {
				useCookies()
			}).toThrow('useCookies must be called within a setup function')
		})

		it('should have descriptive error message', () => {
			expect(() => {
				useCookies()
			}).toThrow(/setup function/)
		})
	})

	describe('integration with component lifecycle', () => {
		it('should work in multiple components', () => {
			const Component1 = defineComponent({
				setup() {
					const cookies = useCookies()
					return { cookies }
				},
				template: '<div>Component 1</div>',
			})

			const Component2 = defineComponent({
				setup() {
					const cookies = useCookies()
					return { cookies }
				},
				template: '<div>Component 2</div>',
			})

			const wrapper1 = mount(Component1, {
				global: { plugins: [cookiesPlugin] },
			})

			const wrapper2 = mount(Component2, {
				global: { plugins: [cookiesPlugin] },
			})

			expect(wrapper1.vm.cookies).toBeDefined()
			expect(wrapper2.vm.cookies).toBeDefined()
		})

		it('should work with composed setup functions', () => {
			const TestComponent = defineComponent({
				setup() {
					const cookies = useCookies()
					return { cookies }
				},
				template: '<div>Test</div>',
			})

			const wrapper = mount(TestComponent, {
				global: {
					plugins: [cookiesPlugin],
				},
			})

			expect(wrapper.vm.cookies).toBeDefined()
		})
	})

	describe('type safety', () => {
		it('should return object with cookie methods', () => {
			const TestComponent = defineComponent({
				setup() {
					const cookies = useCookies()
					const hasGetMethod = typeof cookies.get === 'function'
					const hasSetMethod = typeof cookies.set === 'function'
					const hasRemoveMethod = typeof cookies.remove === 'function'

					return { hasGetMethod, hasSetMethod, hasRemoveMethod }
				},
				template: '<div>Test</div>',
			})

			const wrapper = mount(TestComponent, {
				global: {
					plugins: [cookiesPlugin],
				},
			})

			expect(wrapper.vm.hasGetMethod).toBe(true)
			expect(wrapper.vm.hasSetMethod).toBe(true)
			expect(wrapper.vm.hasRemoveMethod).toBe(true)
		})
	})
})
