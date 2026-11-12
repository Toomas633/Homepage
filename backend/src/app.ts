import express from 'express'
import bodyParser from 'body-parser'
import type { Application, Request, Response, NextFunction } from 'express'
import type { Server } from 'node:http'
import { corsMiddleware } from './middleware/cors.js'
import healthRoutes from './routes/health.js'
import emailRoutes from './routes/email.js'
import githubRoutes from './routes/github.js'
import swaggerRoutes from './routes/swagger.js'
import type { ErrorResponse } from './types/index.js'
import { config } from './config/env.js'
import {
	getTransporter,
	verifyEmailConnection,
	closeTransporter,
} from './services/emailService.js'
import { logWithTimestamp, objectToString } from './utils/helpers.js'

const app: Application = express().disable('x-powered-by')

app.set('trust proxy', 1)

app.use(bodyParser.json())
app.use(corsMiddleware)

app.use('/api', swaggerRoutes)
app.use('/api', healthRoutes)
app.use('/api', emailRoutes)
app.use('/api', githubRoutes)

app.use((req: Request, res: Response<ErrorResponse>) => {
	res.status(404).json({
		error: 'Not Found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
	})
})

app.use(
	(
		error: Error,
		req: Request,
		res: Response<ErrorResponse>,
		_next: NextFunction
	) => {
		console.error('Unhandled error:', error)
		res.status(500).json({
			error: 'Internal Server Error',
			message: 'Something went wrong on the server',
		})
	}
)

export const startServer = (): void => {
	if (config.email.host) {
		logWithTimestamp('info', 'Verifying email server connection...')
		// Opens the single pooled connection that is kept alive for the whole app
		// lifetime. It is intentionally NOT closed here — sendEmail and the health
		// check reuse this same connection so the app only ever logs in once.
		verifyEmailConnection(getTransporter())
			.then((duration) => {
				logWithTimestamp('info', 'Email server connection verified', duration)
			})
			.catch((err) => {
				logWithTimestamp(
					'warn',
					'Email server connection failed - email features may be unavailable'
				)
				const errorInfo =
					err instanceof Error
						? objectToString({
								name: err.name,
								message: err.message,
								stack: err.stack,
							})
						: 'Unknown error'
				console.error(errorInfo)
			})
	}

	const server: Server = app.listen(config.server.port, () => {
		logWithTimestamp('info', `Backend listening on port ${config.server.port}`)
	})

	const gracefulShutdown = (signal: string): void => {
		logWithTimestamp('info', `${signal} received, shutting down gracefully`)
		closeTransporter()
		server.close(() => {
			logWithTimestamp('info', 'Server closed')
			process.exit(0)
		})
	}

	process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
	process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

if (process.env.NODE_ENV !== 'test') {
	await startServer()
}

export default app
