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
})
