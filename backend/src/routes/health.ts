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

const HEALTH_SMTP_TIMEOUT_MS = 12000
const HEALTH_SMTP_RETRIES = 1

const router = Router()

router.get(
	'/health',
	healthRateLimiter,
	async (_req: Request, res: Response<HealthResponse>) => {
		const timestamp = new Date().toISOString()

		const transporter = createTransporter()
		try {
			const emailCheckDuration = await verifyEmailConnection(
				transporter,
				HEALTH_SMTP_TIMEOUT_MS,
				HEALTH_SMTP_RETRIES
			)

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
			res.status(200).json({
				status: 'degraded',
				timestamp,
				version: APP_VERSION,
				email: {
					status: 'disconnected',
					error: errorMessage,
				},
			})
		} finally {
			transporter.close()
		}
	}
)

export default router
