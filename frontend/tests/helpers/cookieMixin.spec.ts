import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useCookieMixin from '../../src/helpers/cookieMixin'

const mockGet = vi.fn()
const mockSet = vi.fn()
const mockRemove = vi.fn()
const mockUpdateConsent = vi.fn()

vi.mock('../../src/helpers/useCookies', () => ({
	default: vi.fn(() => ({
		get: mockGet,
		set: mockSet,
		remove: mockRemove,
	})),
}))

describe('cookieMixin', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		Object.defineProperty(globalThis, 'updateConsent', {
			writable: true,
			configurable: true,
			value: mockUpdateConsent,
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('DEFAULT_CONSENT', () => {
		it('should have correct default consent values', () => {
			const { DEFAULT_CONSENT } = useCookieMixin()

			expect(DEFAULT_CONSENT).toEqual({
				necessary: true,
				ads: false,
				analytics: false,
				userData: false,
			})
		})

		it('should have necessary set to true by default', () => {
			const { DEFAULT_CONSENT } = useCookieMixin()

			expect(DEFAULT_CONSENT.necessary).toBe(true)
		})

		it('should have ads set to false by default', () => {
			const { DEFAULT_CONSENT } = useCookieMixin()

			expect(DEFAULT_CONSENT.ads).toBe(false)
		})

		it('should have analytics set to false by default', () => {
			const { DEFAULT_CONSENT } = useCookieMixin()

			expect(DEFAULT_CONSENT.analytics).toBe(false)
		})

		it('should have userData set to false by default', () => {
			const { DEFAULT_CONSENT } = useCookieMixin()

			expect(DEFAULT_CONSENT.userData).toBe(false)
		})
	})

	describe('consent', () => {
		it('should initialize with default consent', () => {
			const { consent, DEFAULT_CONSENT } = useCookieMixin()

			expect(consent.value).toEqual(DEFAULT_CONSENT)
		})

		it('should be a reactive ref', () => {
			const { consent } = useCookieMixin()

			expect(typeof consent.value).toBe('object')
		})
	})

	describe('acceptAllCookies', () => {
		it('should set all consent values to true', () => {
			const { acceptAllCookies, consent } = useCookieMixin()

			acceptAllCookies()

			expect(consent.value).toEqual({
				necessary: true,
				ads: true,
				analytics: true,
				userData: true,
			})
		})

		it('should call setConsentCookie with acceptedAll', () => {
			const { acceptAllCookies } = useCookieMixin()

			acceptAllCookies()

			expect(mockSet).toHaveBeenCalledWith(
				'cookieConsent',
				'acceptedAll',
				'365d'
			)
		})

		it('should call window.updateConsent with all consents', () => {
			const { acceptAllCookies } = useCookieMixin()

			acceptAllCookies()

			expect(mockUpdateConsent).toHaveBeenCalledWith({
				necessary: true,
				ads: true,
				analytics: true,
				userData: true,
			})
		})
	})

	describe('declineCookies', () => {
		it('should set non-necessary consent values to false', () => {
			const { declineCookies, consent } = useCookieMixin()

			declineCookies()

			expect(consent.value).toEqual({
				necessary: true,
				ads: false,
				analytics: false,
				userData: false,
			})
		})

		it('should keep necessary consent as true', () => {
			const { declineCookies, consent } = useCookieMixin()

			declineCookies()

			expect(consent.value.necessary).toBe(true)
		})

		it('should call setConsentCookie with declined', () => {
			const { declineCookies } = useCookieMixin()

			declineCookies()

			expect(mockSet).toHaveBeenCalledWith('cookieConsent', 'declined', '365d')
		})

		it('should call window.updateConsent with declined consents', () => {
			const { declineCookies } = useCookieMixin()

			declineCookies()

			expect(mockUpdateConsent).toHaveBeenCalledWith({
				necessary: true,
				ads: false,
				analytics: false,
				userData: false,
			})
		})
	})

	describe('setConsentCookie', () => {
		it('should set cookie with acceptedAll string', () => {
			const { setConsentCookie } = useCookieMixin()

			setConsentCookie('acceptedAll')

			expect(mockSet).toHaveBeenCalledWith(
				'cookieConsent',
				'acceptedAll',
				'365d'
			)
		})

		it('should set cookie with declined string', () => {
			const { setConsentCookie } = useCookieMixin()

			setConsentCookie('declined')

			expect(mockSet).toHaveBeenCalledWith('cookieConsent', 'declined', '365d')
		})

		it('should set cookie with consent object', () => {
			const { setConsentCookie } = useCookieMixin()
			const customConsent = {
				necessary: true,
				ads: true,
				analytics: false,
				userData: false,
			}

			setConsentCookie(customConsent)

			expect(mockSet).toHaveBeenCalledWith(
				'cookieConsent',
				customConsent,
				'365d'
			)
		})

		it('should set cookie with 365 day expiry', () => {
			const { setConsentCookie } = useCookieMixin()

			setConsentCookie('acceptedAll')

			expect(mockSet).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				'365d'
			)
		})
	})

	describe('removeAllCookies', () => {
		it('should remove the consent cookie', () => {
			const { removeAllCookies } = useCookieMixin()

			removeAllCookies()

			expect(mockRemove).toHaveBeenCalledWith('cookieConsent')
		})

		it('should call remove exactly once', () => {
			const { removeAllCookies } = useCookieMixin()

			removeAllCookies()

			expect(mockRemove).toHaveBeenCalledTimes(1)
		})
	})

	describe('readConsentCookie', () => {
		it('should return undefined when no cookie exists', () => {
			const { readConsentCookie } = useCookieMixin()
			mockGet.mockReturnValue(undefined)

			const result = readConsentCookie()

			expect(result).toBeUndefined()
		})

		it('should return acceptedAll when cookie value is acceptedAll', () => {
			const { readConsentCookie } = useCookieMixin()
			mockGet.mockReturnValue('acceptedAll')

			const result = readConsentCookie()

			expect(result).toBe('acceptedAll')
		})

		it('should return declined when cookie value is declined', () => {
			const { readConsentCookie } = useCookieMixin()
			mockGet.mockReturnValue('declined')

			const result = readConsentCookie()

			expect(result).toBe('declined')
		})

		it('should return consent object when valid consent is stored', () => {
			const { readConsentCookie } = useCookieMixin()
			const validConsent = {
				necessary: true,
				ads: true,
				analytics: false,
				userData: true,
			}
			mockGet.mockReturnValue(validConsent)

			const result = readConsentCookie()

			expect(result).toEqual(validConsent)
		})

		it('should return undefined for invalid consent object', () => {
			const { readConsentCookie } = useCookieMixin()
			mockGet.mockReturnValue({ invalid: 'object' })

			const result = readConsentCookie()

			expect(result).toBeUndefined()
		})

		it('should handle parsing errors gracefully', () => {
			const { readConsentCookie } = useCookieMixin()
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})
			const badObject = {}
			Object.defineProperty(badObject, 'necessary', {
				get() {
					throw new Error('Parse error')
				},
			})
			mockGet.mockReturnValue(badObject)

			const result = readConsentCookie()

			expect(result).toBeUndefined()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error parsing consent cookie:',
				expect.any(Error)
			)
			consoleErrorSpy.mockRestore()
		})
	})

	describe('isConsent', () => {
		it('should return true for valid consent object', () => {
			const { isConsent } = useCookieMixin()
			const validConsent = {
				necessary: true,
				ads: false,
				analytics: true,
				userData: false,
			}

			expect(isConsent(validConsent)).toBe(true)
		})

		it('should return false for null', () => {
			const { isConsent } = useCookieMixin()

			expect(isConsent(null)).toBe(false)
		})

		it('should return false for undefined', () => {
			const { isConsent } = useCookieMixin()

			expect(isConsent(undefined)).toBe(false)
		})

		it('should return false for object with missing fields', () => {
			const { isConsent } = useCookieMixin()

			expect(isConsent({ necessary: true })).toBe(false)
		})

		it('should return false for object with wrong types', () => {
			const { isConsent } = useCookieMixin()

			expect(
				isConsent({
					necessary: 'true',
					ads: false,
					analytics: false,
					userData: false,
				})
			).toBe(false)
		})

		it('should return false for non-object values', () => {
			const { isConsent } = useCookieMixin()

			expect(isConsent('string')).toBe(false)
			expect(isConsent(123)).toBe(false)
			expect(isConsent(true)).toBe(false)
		})

		it('should return false for array', () => {
			const { isConsent } = useCookieMixin()

			expect(isConsent([true, false, false, false])).toBe(false)
		})
	})
})
