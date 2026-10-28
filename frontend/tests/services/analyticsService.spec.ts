import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { trackEvent, updateConsent } from '@/services/analyticsService'

vi.mock('axios')

const consent = (analytics: boolean) => ({
	necessary: true,
	ads: false,
	analytics,
	userData: false,
})

describe('analyticsService', () => {
	beforeEach(() => {
		vi.mocked(axios.post).mockReset().mockResolvedValue({})
		updateConsent(consent(false))
		vi.mocked(axios.post).mockClear()
	})

	it('does not send events without analytics consent', () => {
		trackEvent('button_click')
		expect(axios.post).not.toHaveBeenCalled()
	})

	it('sends a page view when consent is granted and then custom events', () => {
		updateConsent(consent(true))
		expect(axios.post).toHaveBeenCalledWith(
			expect.stringContaining('/pulse/event'),
			expect.objectContaining({ name: 'page_view' })
		)
		trackEvent('button_click', { id: 'send' })
		expect(axios.post).toHaveBeenLastCalledWith(
			expect.any(String),
			expect.objectContaining({
				name: 'button_click',
				params: { id: 'send' },
				consent: { analytics: true },
			})
		)
	})

	it('stops sending after consent is withdrawn', () => {
		updateConsent(consent(true))
		updateConsent(consent(false))
		vi.mocked(axios.post).mockClear()
		trackEvent('button_click')
		expect(axios.post).not.toHaveBeenCalled()
	})
})

describe('auto tracking', () => {
	beforeEach(() => {
		vi.mocked(axios.post).mockReset().mockResolvedValue({})
		updateConsent({
			necessary: true,
			ads: false,
			analytics: true,
			userData: false,
		})
		vi.mocked(axios.post).mockClear()
	})

	it('tracks outbound clicks only for external links', async () => {
		const { trackOutboundClick } = await import('@/services/analyticsService')
		trackOutboundClick('/projects')
		expect(axios.post).not.toHaveBeenCalled()
		trackOutboundClick('https://github.com/Toomas633/Homepage?x=1', 'test')
		expect(axios.post).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				name: 'outbound_click',
				params: {
					host: 'github.com',
					url: 'https://github.com/Toomas633/Homepage',
					source: 'test',
				},
			})
		)
	})

	it('tracks anchor clicks through the delegated listener', () => {
		const a = document.createElement('a')
		a.setAttribute('href', 'https://example.com/x')
		document.body.appendChild(a)
		a.click()
		expect(axios.post).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ name: 'outbound_click' })
		)
		a.remove()
	})
})
