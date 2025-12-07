import express from 'express'
import bodyParser from 'body-parser'
import type { Application, Request, Response, NextFunction } from 'express'
import type { Server } from 'node:http'
import swaggerUi from 'swagger-ui-express'
import { corsMiddleware } from './middleware/cors.js'
import healthRoutes from './routes/health.js'
import emailRoutes from './routes/email.js'
import githubRoutes from './routes/github.js'
import type { ErrorResponse } from './types/index.js'
import { config } from './config/env.js'
import { swaggerSpec } from './config/swagger.js'
import {
	createTransporter,
	verifyEmailConnection,
} from './services/emailService.js'
import { logWithTimestamp, objectToString } from './utils/helpers.js'

const app: Application = express().disable('x-powered-by')

app.set('trust proxy', 1)

app.use(bodyParser.json())
app.use(corsMiddleware)

app.use(
	'/api/swagger-ui',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customSiteTitle: "Toomas633's Dungeon API Documentation",
		customCss: '.swagger-ui .topbar { display: none }',
		swaggerOptions: {
			persistAuthorization: true,
		},
	})
)

app.get('/api/swagger-ui.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(swaggerSpec)
})

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

export const startServer = async (): Promise<void> => {
	logWithTimestamp('info', 'Verifying email server connection...')
	const transporter = createTransporter()
	verifyEmailConnection(transporter)
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

	const server: Server = app.listen(config.server.port, () => {
		logWithTimestamp('info', `Backend listening on port ${config.server.port}`)
	})

	const gracefulShutdown = (signal: string): void => {
		logWithTimestamp('info', `${signal} received, shutting down gracefully`)
		server.close(() => {
			logWithTimestamp('info', 'Server closed')
			process.exit(0)
		})
	}

	process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
	process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

if (process.env.NODE_ENV !== 'test') {
	startServer()
}

export default app
