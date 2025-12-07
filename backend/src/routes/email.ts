import { Router } from 'express'
import type { Request, Response } from 'express'
import { sendEmail } from '../services/emailService.js'
import { emailRateLimiter } from '../middleware/rateLimiter.js'
import { objectToString } from '../utils/helpers.js'
import type { ApiResponse } from '../types/index.js'

interface EmailRequest extends Request {
	body: {
		from: string
		message: string
		project: string
	}
}

const router = Router()

router.post(
	'/send-email',
	emailRateLimiter,
	async (req: EmailRequest, res: Response<ApiResponse>) => {
		const { from, message, project } = req.body

		try {
			const info = await sendEmail({ from, message, project })
			res.status(200).json({ success: true, data: info })
		} catch (error) {
			const errorInfo =
				error instanceof Error
					? objectToString({
							name: error.name,
							message: error.message,
							stack: error.stack,
						})
					: 'Unknown error'

			res.status(500).json({
				success: false,
				message: 'Error sending email',
				error: errorInfo,
			})
		}
	}
)

export default router
