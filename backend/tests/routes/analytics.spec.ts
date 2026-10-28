import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import analyticsRouter from '../../src/routes/analytics'
import { analyticsService } from '../../src/services/analyticsService'
import { config } from '../../src/config/env'

const bearer = ['Bearer', 'secret'].join(' ')

describe('Analytics Route', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use(express.json())
		app.use('/api', analyticsRouter)
		analyticsService.reset()
		config.analytics.statsToken = 'secret'
	})

	const collect = (body: object, headers: Record<string, string> = {}) =>
		request(app).post('/api/pulse/event').set(headers).send(body)

	it('rejects invalid event names', async () => {
		const res = await collect({
			name: 'bad name!',
			consent: { analytics: true },
		})
		expect(res.status).toBe(400)
	})

	it('ignores events without consent', async () => {
		const res = await collect({ name: 'page_view', path: '/' })
		expect(res.status).toBe(202)
		expect(analyticsService.getStats().totals.events).toBe(0)
	})

	it('ignores events when Do-Not-Track is set', async () => {
		await collect(
			{ name: 'page_view', consent: { analytics: true } },
			{ DNT: '1' }
		)
		expect(analyticsService.getStats().totals.events).toBe(0)
	})

	it('records consented events without personal data', async () => {
		await collect({
			name: 'page_view',
			path: '/projects?email=a@b.c#x',
			referrer: 'https://example.com/some/page?q=1',
			consent: { analytics: true },
		})
		await collect({
			name: 'button_click',
			params: { id: 'send', nested: { a: 1 } },
			consent: { analytics: true },
		})
		const stats = analyticsService.getStats()
		expect(stats.totals).toEqual({
			events: 2,
			pageviews: 1,
			uniqueVisitors: 1,
		})
		expect(stats.topPages).toEqual([{ name: '/projects', count: 1 }])
		expect(stats.referrers).toEqual([{ name: 'https://example.com', count: 1 }])
	})

	it('protects the stats endpoint', async () => {
		expect((await request(app).get('/api/pulse/stats')).status).toBe(401)
		config.analytics.statsToken = ''
		expect((await request(app).get('/api/pulse/stats')).status).toBe(503)
	})

	it('returns stats as JSON and Prometheus text', async () => {
		await collect({
			name: 'page_view',
			path: '/',
			consent: { analytics: true },
		})
		const json = await request(app)
			.get('/api/pulse/stats')
			.set('Authorization', bearer)
		expect(json.status).toBe(200)
		expect(json.body.data.totals.pageviews).toBe(1)
		const prom = await request(app)
			.get('/api/pulse/stats?format=prometheus')
			.set('Authorization', bearer)
		expect(prom.text).toContain('homepage_pageviews_total 1')
	})

	it('exposes public config', async () => {
		const res = await request(app).get('/api/pulse/config')
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveProperty('adsenseClientId')
	})
})
