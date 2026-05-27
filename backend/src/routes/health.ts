import { Router } from 'express'
import type { Request, Response } from 'express'
import {
	createTransporter,
	verifyEmailConnection,
} from '../services/emailService.js'
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

		try {
			const transporter = createTransporter()
			const emailCheckDuration = await verifyEmailConnection(transporter, undefined, 0)

			res.status(200).json({
				status: 'healthy',
				timestamp,
				version: APP_VERSION,
				email: {
					status: 'connected',
					responseTime: `${emailCheckDuration}ms`,
				},
			})
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			res.status(503).json({
				status: 'unhealthy',
				timestamp,
				version: APP_VERSION,
				email: {
					status: 'disconnected',
					error: errorMessage,
				},
			})
		}
	}
)

export default router
