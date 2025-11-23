import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('vue', async () => {
	const actual = await vi.importActual('vue')
	return {
		...actual,
		createApp: vi.fn(() => ({
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		})),
	}
})

vi.mock('../src/App.vue', () => ({
	default: {},
}))

vi.mock('../src/router', () => ({
	default: {},
}))

vi.mock('../src/plugins/vuetify', () => ({
	default: {},
}))

vi.mock('vue-cookies', () => ({
	default: {},
}))

vi.mock('@basitcodeenv/vue3-device-detect', () => ({
	default: {},
}))

vi.mock('@vueuse/head', () => ({
	createHead: vi.fn(() => ({})),
}))

vi.mock('leaflet/dist/leaflet.css', () => ({}))

describe('main.ts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.resetModules()
	})

	it('should create Vue app with App component', async () => {
		const { createApp } = await import('vue')
		const App = await import('../src/App.vue')

		await import('../src/main')

		expect(createApp).toHaveBeenCalledWith(App.default)
	})

	it('should use Router plugin', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		const Router = await import('../src/router')

		await import('../src/main')

		expect(mockApp.use).toHaveBeenCalledWith(Router.default)
	})

	it('should use Vuetify plugin', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		const Vuetify = await import('../src/plugins/vuetify')

		await import('../src/main')

		expect(mockApp.use).toHaveBeenCalledWith(Vuetify.default)
	})

	it('should use VueCookies plugin', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		const VueCookies = await import('vue-cookies')

		await import('../src/main')

		expect(mockApp.use).toHaveBeenCalledWith(VueCookies.default)
	})

	it('should use VueDeviceDetect plugin', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		const VueDeviceDetect = await import('@basitcodeenv/vue3-device-detect')

		await import('../src/main')

		expect(mockApp.use).toHaveBeenCalledWith(VueDeviceDetect.default)
	})

	it('should create and use head plugin', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}
		const mockHead = {}

		const { createApp } = await import('vue')
		const { createHead } = await import('@vueuse/head')

		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)
		vi.mocked(createHead).mockReturnValue(
			mockHead as unknown as ReturnType<typeof createHead>
		)

		await import('../src/main')

		expect(createHead).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalledWith(mockHead)
	})

	it('should mount app to #app element', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		await import('../src/main')

		expect(mockApp.mount).toHaveBeenCalledWith('#app')
	})

	it('should use all plugins in correct order', async () => {
		const mockApp = {
			use: vi.fn().mockReturnThis(),
			mount: vi.fn(),
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		const Router = await import('../src/router')
		const Vuetify = await import('../src/plugins/vuetify')
		const VueCookies = await import('vue-cookies')
		const VueDeviceDetect = await import('@basitcodeenv/vue3-device-detect')

		await import('../src/main')

		const useCalls = vi.mocked(mockApp.use).mock.calls

		expect(useCalls[0][0]).toBe(Router.default)
		expect(useCalls[1][0]).toBe(Vuetify.default)
		expect(useCalls[2][0]).toBe(VueCookies.default)
		expect(useCalls[3][0]).toBe(VueDeviceDetect.default)
		expect(useCalls[4][0]).toBeDefined()
	})

	it('should chain all operations correctly', async () => {
		const mockMount = vi.fn()
		const mockUse = vi.fn().mockReturnThis()
		const mockApp = {
			use: mockUse,
			mount: mockMount,
		}

		const { createApp } = await import('vue')
		vi.mocked(createApp).mockReturnValue(
			mockApp as unknown as ReturnType<typeof createApp>
		)

		await import('../src/main')

		expect(mockUse).toHaveBeenCalledTimes(5)
		expect(mockMount).toHaveBeenCalledTimes(1)
	})
})
