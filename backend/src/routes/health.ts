import { Router } from 'express'
import type { Request, Response } from 'express'
import { getEmailHealth } from '../services/emailService.js'
import { healthRateLimiter } from '../middleware/rateLimiter.js'
import { HealthResponse } from '../types/index.js'

const APP_VERSION =
	process.env.APP_VERSION ||
	(globalThis as { __APP_VERSION__?: string }).__APP_VERSION__ ||
	'unknown'

const router = Router()

router.get(
	'/health',
	healthRateLimiter,
	async (_req: Request, res: Response<HealthResponse>) => {
		const timestamp = new Date().toISOString()

		// Uses a cached check so repeated polling does not open a new SMTP login
		// each time (which can trip the mail server's fail2ban during an outage).
		const email = await getEmailHealth()

		if (email.status === 'connected') {
			res.status(200).json({
				status: 'healthy',
				timestamp,
				version: APP_VERSION,
				email: {
					status: 'connected',
					responseTime: email.responseTime,
				},
			})
			return
		}

		res.status(200).json({
			status: 'degraded',
			timestamp,
			version: APP_VERSION,
			email: {
				status: 'disconnected',
				error: email.error,
			},
		})
	}
)

export default router
