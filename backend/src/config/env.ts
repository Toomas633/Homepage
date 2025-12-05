import dotenv from 'dotenv'
import type { AppConfig } from '../types/index.js'

dotenv.config()

const {
	EMAIL_HOST,
	EMAIL_USER,
	EMAIL_PASS,
	EMAIL_TO,
	ALLOWED_ORIGINS,
	EMAIL_PORT,
	EMAIL_TLS,
} = process.env

const requiredEnvVars: Record<string, string | undefined> = {
	EMAIL_HOST,
	EMAIL_USER,
	EMAIL_PORT,
	EMAIL_TLS,
	EMAIL_PASS,
	EMAIL_TO,
	ALLOWED_ORIGINS,
}

// Skip validation in test environment (mocked in test setup)
if (process.env.NODE_ENV !== 'test') {
	for (const [key, value] of Object.entries(requiredEnvVars)) {
		if (value === undefined) {
			console.error(`Missing required environment variable: ${key}`)
			process.exit(1)
		}
	}
}

export const config: AppConfig = {
	email: {
		host: EMAIL_HOST!,
		user: EMAIL_USER!,
		password: EMAIL_PASS!,
		to: EMAIL_TO!,
		port: Number(EMAIL_PORT),
		requireTLS: EMAIL_TLS === 'true',
	},
	server: {
		port: 3000,
	},
	allowedOrigins: {
		origins: ALLOWED_ORIGINS?.split(',') || [],
	},
}

export const rateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per windowMs
	message:
		'Too many emails sent from this IP, please try again after 15 minutes',
}
