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
	EMAIL_REJECT_UNAUTHORIZED,
	GITHUB_TOKEN,
} = process.env

const optionalEnvVars: Record<string, string | undefined> = {
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_TO,
	EMAIL_TLS,
	ALLOWED_ORIGINS,
}

for (const [key, value] of Object.entries(optionalEnvVars)) {
	if (value === undefined || value === '') {
		console.warn(`Optional environment variable not set: ${key}`)
	}
}

export const config: AppConfig = {
	email: {
		host: EMAIL_HOST || '',
		user: EMAIL_USER || '',
		password: EMAIL_PASS || '',
		to: EMAIL_TO || '',
		port: Number(EMAIL_PORT) || 587,
		requireTLS: EMAIL_TLS === 'true',
		tlsRejectUnauthorized: EMAIL_REJECT_UNAUTHORIZED !== 'false',
	},
	server: {
		port: 3000,
	},
	allowedOrigins: {
		origins: ALLOWED_ORIGINS?.split(',') || [],
	},
	github: {
		token: GITHUB_TOKEN,
	},
}

export const rateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per windowMs
	message:
		'Too many emails sent from this IP, please try again after 15 minutes',
}
