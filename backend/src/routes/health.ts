import { Router } from 'express'
import type { Request, Response } from 'express'
import {
	createTransporter,
	verifyEmailConnection,
} from '../services/emailService.js'
import { healthRateLimiter } from '../middleware/rateLimiter.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(
	readFileSync(join(__dirname, '../../package.json'), 'utf-8')
)

interface HealthResponse {
	status: 'healthy' | 'unhealthy'
	timestamp: string
	version: string
	email: {
		status: 'connected' | 'disconnected'
		responseTime?: string
		error?: string
	}
}

const router = Router()

router.get(
	'/api/health',
	healthRateLimiter,
	async (_req: Request, res: Response<HealthResponse>) => {
		const timestamp = new Date().toISOString()

		try {
			const transporter = createTransporter()
			const emailCheckDuration = await verifyEmailConnection(transporter)

			res.status(200).json({
				status: 'healthy',
				timestamp,
				version: packageJson.version,
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
				version: packageJson.version,
				email: {
					status: 'disconnected',
					error: errorMessage,
				},
			})
		}
	}
)

export default router
