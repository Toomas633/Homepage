import { Router } from 'express'
import type { Request, Response } from 'express'
import { timingSafeEqual } from 'node:crypto'
import { config } from '../config/env.js'
import { analyticsRateLimiter } from '../middleware/rateLimiter.js'
import {
	analyticsService,
	isValidEventName,
} from '../services/analyticsService.js'
import type { AnalyticsEventInput } from '../types/index.js'

const router = Router()

const safeEqual = (a: string, b: string): boolean => {
	const bufA = Buffer.from(a)
	const bufB = Buffer.from(b)
	return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

const parseDate = (value: unknown): number | undefined => {
	if (typeof value !== 'string' || !value) return undefined
	const time = Date.parse(value)
	return Number.isNaN(time) ? undefined : time
}

// Public: tells the frontend which third-party ad client to load (if any)
router.get('/analytics/config', (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		data: { adsenseClientId: config.analytics.adsenseClientId || null },
	})
})

// Collect an event. Requires explicit analytics consent (GDPR) and honours
// Do-Not-Track / Global Privacy Control. No IP address or cookie is stored.
router.post(
	'/analytics/collect',
	analyticsRateLimiter,
	(req: Request, res: Response) => {
		const body = (req.body ?? {}) as Partial<AnalyticsEventInput>

		if (!isValidEventName(body.name)) {
			res.status(400).json({ success: false, message: 'Invalid event name' })
			return
		}

		if (
			body.consent?.analytics !== true ||
			req.headers['dnt'] === '1' ||
			req.headers['sec-gpc'] === '1'
		) {
			res.status(202).json({ success: true, message: 'Event ignored' })
			return
		}

		analyticsService.record(
			body as AnalyticsEventInput,
			req.ip || '',
			req.headers['user-agent'] || ''
		)
		res.status(202).json({ success: true })
	}
)

// Protected statistics for Grafana (JSON / Infinity datasource) or Prometheus
router.get('/analytics/stats', (req: Request, res: Response) => {
	const token = config.analytics.statsToken
	if (!token) {
		res.status(503).json({
			success: false,
			message: 'Statistics endpoint is not configured',
		})
		return
	}

	const header = req.headers.authorization || ''
	const provided = header.startsWith('Bearer ') ? header.slice(7) : ''
	if (!safeEqual(provided, token)) {
		res.status(401).json({ success: false, message: 'Unauthorized' })
		return
	}

	const stats = analyticsService.getStats(
		parseDate(req.query.from),
		parseDate(req.query.to)
	)
	if (req.query.format === 'prometheus') {
		res.type('text/plain').send(analyticsService.toPrometheus(stats))
		return
	}
	res.status(200).json({ success: true, data: stats })
})

export default router
