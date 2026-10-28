import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
	createMatomoDestination,
	createPlausibleDestination,
	createWebhookDestination,
} from '../../src/services/analyticsService'
import type { AnalyticsEvent } from '../../src/types/index.js'

vi.mock('axios')

const event: AnalyticsEvent = {
	name: 'contact_submit',
	timestamp: 1,
	visitorId: 'abcdef0123456789abcdef0123456789',
	path: '/contact',
	title: 'Contact',
	referrer: 'https://example.com',
	device: 'desktop',
	params: { project: 'x' },
}

describe('analytics destinations', () => {
	beforeEach(() => {
		vi.mocked(axios.post).mockReset().mockResolvedValue({})
		vi.mocked(axios.get).mockReset().mockResolvedValue({})
	})

	it('forwards to Plausible without an IP', async () => {
		await createPlausibleDestination(
			'https://p.io',
			'toomas633.com',
			'https://toomas633.com'
		).send(event)
		const [url, body, opts] = vi.mocked(axios.post).mock.calls[0]
		expect(url).toBe('https://p.io/api/event')
		expect(body).toMatchObject({
			name: 'contact_submit',
			url: 'https://toomas633.com/contact',
			domain: 'toomas633.com',
			props: { project: 'x' },
		})
		expect(opts?.headers?.['X-Forwarded-For']).toBe('127.0.0.1')
	})

	it('maps page_view to pageview for Plausible', async () => {
		await createPlausibleDestination('https://p.io', 'd', 'https://s').send({
			...event,
			name: 'page_view',
		})
		expect(vi.mocked(axios.post).mock.calls[0][1]).toMatchObject({
			name: 'pageview',
		})
	})

	it('forwards custom events to Matomo as events', async () => {
		await createMatomoDestination(
			'https://m.io',
			'1',
			'https://toomas633.com'
		).send(event)
		const [url, opts] = vi.mocked(axios.get).mock.calls[0]
		expect(url).toBe('https://m.io/matomo.php')
		expect(opts?.params).toMatchObject({
			idsite: '1',
			_id: 'abcdef0123456789',
			e_c: 'event',
			e_a: 'contact_submit',
		})
	})

	it('posts raw events to a webhook', async () => {
		await createWebhookDestination('https://w.io/hook', 'tok').send(event)
		const [url, body, opts] = vi.mocked(axios.post).mock.calls[0]
		expect(url).toBe('https://w.io/hook')
		expect(body).toBe(event)
		expect(opts?.headers?.Authorization).toBe(['Bearer', 'tok'].join(' '))
	})
})
