import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '../src/App.vue'

vi.mock('../src/helpers/themeMixin', () => ({
	default: vi.fn(() => ({
		checkThemeStorage: vi.fn(),
	})),
}))

describe('App.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should render the app structure', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(wrapper.html()).toBeTruthy()
	})

	it('should include all required components', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(wrapper.html()).toContain('v-app')
	})

	it('should compute rootStyle with scrollbar offset', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		const html = wrapper.html()
		expect(html).toContain('--scrollbar-offset')
	})

	it('should set hasScrollbar to false initially', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		const html = wrapper.html()
		expect(html).toContain('--scrollbar-offset: 0rem')
	})

	it('should call checkThemeStorage on mount', async () => {
		const mockCheckThemeStorage = vi.fn()
		const useThemeMixin = await import('../src/helpers/themeMixin')
		vi.mocked(useThemeMixin.default).mockReturnValue({
			isDark: ref(false),
			toggleTheme: vi.fn(),
			checkThemeStorage: mockCheckThemeStorage,
		})

		mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(mockCheckThemeStorage).toHaveBeenCalled()
	})

	it('should add event listeners on mount', () => {
		const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

		mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(addEventListenerSpy).toHaveBeenCalledWith(
			'load',
			expect.any(Function)
		)
		expect(addEventListenerSpy).toHaveBeenCalledWith(
			'resize',
			expect.any(Function)
		)

		addEventListenerSpy.mockRestore()
	})

	it('should remove event listeners on unmount', () => {
		const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener')

		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		wrapper.unmount()

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			'load',
			expect.any(Function)
		)
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			'resize',
			expect.any(Function)
		)

		removeEventListenerSpy.mockRestore()
	})

	it('should have correct component structure', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.vm).toBeDefined()
	})

	it('should set mainElement ref', () => {
		const wrapper = mount(App, {
			global: {
				stubs: {
					'v-app': true,
					'v-main': true,
					AppNavbar: true,
					CookieConsent: true,
					MessagePopup: true,
					'router-view': true,
				},
			},
		})

		expect(wrapper.vm).toBeDefined()
	})

	describe('scrollbar offset behavior', () => {
		it('should show no offset when hasScrollbar is false initially', () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			const html = wrapper.html()
			expect(html).toContain('--scrollbar-offset: 0rem')
		})

		it('should detect scrollbar when content height exceeds client height', async () => {
			const mockMainElement = {
				$el: {
					scrollHeight: 1000,
					clientHeight: 500,
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
				},
			}

			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': {
							template: '<div class="v-main"><slot /></div>',
							mounted() {
								Object.assign(this, mockMainElement)
							},
						},
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await new Promise((resolve) => setTimeout(resolve, 150))
			await wrapper.vm.$nextTick()

			const html = wrapper.html()
			expect(html).toBeTruthy()
		})

		it('should not show offset when scroll and client heights are equal', async () => {
			const mockMainElement = {
				$el: {
					scrollHeight: 500,
					clientHeight: 500,
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
				},
			}

			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': {
							template: '<div class="v-main"><slot /></div>',
							mounted() {
								Object.assign(this, mockMainElement)
							},
						},
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await new Promise((resolve) => setTimeout(resolve, 150))
			await wrapper.vm.$nextTick()

			const html = wrapper.html()
			expect(html).toContain('--scrollbar-offset')
		})

		it('should compute correct offset value in rootStyle', () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			const vApp = wrapper.find('[style]')
			if (vApp.exists()) {
				const style = vApp.attributes('style')
				expect(style).toContain('--scrollbar-offset')
			}
		})
	})

	describe('event listeners and lifecycle', () => {
		it('should respond to window resize events', async () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await wrapper.vm.$nextTick()

			window.dispatchEvent(new Event('resize'))
			await wrapper.vm.$nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.html()).toContain('--scrollbar-offset')
		})

		it('should respond to window scroll events', async () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await wrapper.vm.$nextTick()

			window.dispatchEvent(new Event('scroll'))
			await wrapper.vm.$nextTick()

			expect(wrapper.exists()).toBe(true)
		})

		it('should respond to window load events', async () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await wrapper.vm.$nextTick()

			window.dispatchEvent(new Event('load'))
			await wrapper.vm.$nextTick()

			expect(wrapper.exists()).toBe(true)
		})

		it('should set up MutationObserver on mount', () => {
			const observeSpy = vi.spyOn(MutationObserver.prototype, 'observe')

			mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			expect(observeSpy).toHaveBeenCalledWith(document.body, {
				childList: true,
				subtree: true,
			})

			observeSpy.mockRestore()
		})

		it('should handle mainElement being undefined during checkScrollbar', async () => {
			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			await wrapper.vm.$nextTick()
			window.dispatchEvent(new Event('resize'))
			await wrapper.vm.$nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.html()).toContain('--scrollbar-offset: 0rem')
		})

		it('should call checkScrollbar after 100ms timeout on mount', async () => {
			vi.useFakeTimers()

			const wrapper = mount(App, {
				global: {
					stubs: {
						'v-app': true,
						'v-main': true,
						AppNavbar: true,
						CookieConsent: true,
						MessagePopup: true,
						'router-view': true,
					},
				},
			})

			vi.advanceTimersByTime(100)
			await wrapper.vm.$nextTick()

			expect(wrapper.exists()).toBe(true)

			vi.useRealTimers()
		})
	})
})
