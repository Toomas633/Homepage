import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

const mockThemeNameRef = ref('lightTheme')
const mockChange = vi.fn()

vi.mock('vuetify', () => ({
	useTheme: vi.fn(() => ({
		global: {
			name: mockThemeNameRef,
		},
		change: mockChange,
	})),
}))

import useThemeMixin from '../../src/helpers/themeMixin'

describe('themeMixin', () => {
	let localStorageGetItemSpy: ReturnType<typeof vi.fn>
	let localStorageSetItemSpy: ReturnType<typeof vi.fn>

	beforeEach(() => {
		vi.clearAllMocks()

		mockThemeNameRef.value = 'lightTheme'

		localStorageGetItemSpy = vi.fn()
		localStorageSetItemSpy = vi.fn()

		Object.defineProperty(globalThis, 'localStorage', {
			value: {
				getItem: localStorageGetItemSpy,
				setItem: localStorageSetItemSpy,
			},
			writable: true,
			configurable: true,
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('initialization', () => {
		it('should initialize isDark based on theme name', () => {
			mockThemeNameRef.value = 'darkTheme'
			const { isDark } = useThemeMixin()

			expect(isDark.value).toBe(true)
		})

		it('should initialize with light theme when theme is lightTheme', () => {
			mockThemeNameRef.value = 'lightTheme'
			const { isDark } = useThemeMixin()

			expect(isDark.value).toBe(false)
		})

		it('should return reactive isDark ref', () => {
			const { isDark } = useThemeMixin()

			expect(typeof isDark.value).toBe('boolean')
		})
	})

	describe('apply', () => {
		it('should change theme to darkTheme', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).toHaveBeenCalledWith('darkTheme')
		})

		it('should change theme to lightTheme', () => {
			mockThemeNameRef.value = 'darkTheme'
			localStorageGetItemSpy.mockReturnValue('lightTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).toHaveBeenCalledWith('lightTheme')
		})

		it('should update isDark when applying darkTheme', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { isDark, checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(isDark.value).toBe(true)
		})

		it('should update isDark when applying lightTheme', () => {
			mockThemeNameRef.value = 'darkTheme'
			localStorageGetItemSpy.mockReturnValue('lightTheme')

			const { isDark, checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(isDark.value).toBe(false)
		})

		it('should save theme preference to localStorage', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(localStorageSetItemSpy).toHaveBeenCalledWith(
				'preferredTheme',
				'darkTheme'
			)
		})
	})

	describe('toggleTheme', () => {
		it('should toggle from light to dark', () => {
			mockThemeNameRef.value = 'lightTheme'

			const { toggleTheme, isDark } = useThemeMixin()
			expect(isDark.value).toBe(false)

			toggleTheme()

			expect(mockChange).toHaveBeenCalledWith('darkTheme')
			expect(isDark.value).toBe(true)
		})

		it('should toggle from dark to light', () => {
			mockThemeNameRef.value = 'darkTheme'

			const { toggleTheme, isDark } = useThemeMixin()
			expect(isDark.value).toBe(true)

			toggleTheme()

			expect(mockChange).toHaveBeenCalledWith('lightTheme')
			expect(isDark.value).toBe(false)
		})

		it('should save preference to localStorage when toggling', () => {
			mockThemeNameRef.value = 'lightTheme'

			const { toggleTheme } = useThemeMixin()
			toggleTheme()

			expect(localStorageSetItemSpy).toHaveBeenCalledWith(
				'preferredTheme',
				'darkTheme'
			)
		})

		it('should toggle back and forth correctly', () => {
			mockThemeNameRef.value = 'lightTheme'

			const { toggleTheme, isDark } = useThemeMixin()

			toggleTheme()
			expect(isDark.value).toBe(true)

			toggleTheme()
			expect(isDark.value).toBe(false)

			toggleTheme()
			expect(isDark.value).toBe(true)
		})
	})

	describe('checkThemeStorage', () => {
		it('should apply stored darkTheme preference', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).toHaveBeenCalledWith('darkTheme')
			expect(localStorageSetItemSpy).toHaveBeenCalledWith(
				'preferredTheme',
				'darkTheme'
			)
		})

		it('should apply stored lightTheme preference', () => {
			localStorageGetItemSpy.mockReturnValue('lightTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).toHaveBeenCalledWith('lightTheme')
			expect(localStorageSetItemSpy).toHaveBeenCalledWith(
				'preferredTheme',
				'lightTheme'
			)
		})

		it('should not change theme when no preference is stored', () => {
			localStorageGetItemSpy.mockReturnValue(null)

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).not.toHaveBeenCalled()
		})

		it('should not change theme for invalid stored value', () => {
			localStorageGetItemSpy.mockReturnValue('invalidTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(mockChange).not.toHaveBeenCalled()
		})

		it('should read from correct localStorage key', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(localStorageGetItemSpy).toHaveBeenCalledWith('preferredTheme')
		})
	})

	describe('watch functionality', () => {
		it('should update isDark when theme name changes', async () => {
			const { isDark } = useThemeMixin()

			mockThemeNameRef.value = 'darkTheme'

			await new Promise((resolve) => setTimeout(resolve, 0))

			expect(isDark.value).toBe(true)
		})
	})

	describe('STORAGE_KEY constant', () => {
		it('should use preferredTheme as storage key', () => {
			localStorageGetItemSpy.mockReturnValue('darkTheme')

			const { checkThemeStorage } = useThemeMixin()
			checkThemeStorage()

			expect(localStorageGetItemSpy).toHaveBeenCalledWith('preferredTheme')
			expect(localStorageSetItemSpy).toHaveBeenCalledWith(
				'preferredTheme',
				expect.any(String)
			)
		})
	})
})
