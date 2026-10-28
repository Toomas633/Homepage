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
	GA4_MEASUREMENT_ID,
	GA4_API_SECRET,
	ADSENSE_CLIENT_ID,
	ANALYTICS_STATS_TOKEN,
	ANALYTICS_RETENTION_DAYS,
	ANALYTICS_MAX_EVENTS,
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
	analytics: {
		ga4MeasurementId: GA4_MEASUREMENT_ID || '',
		ga4ApiSecret: GA4_API_SECRET || '',
		adsenseClientId: ADSENSE_CLIENT_ID || '',
		statsToken: ANALYTICS_STATS_TOKEN || '',
		retentionDays: Number(ANALYTICS_RETENTION_DAYS) || 30,
		maxEvents: Number(ANALYTICS_MAX_EVENTS) || 50000,
	},
}

export const rateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per windowMs
	message:
		'Too many emails sent from this IP, please try again after 15 minutes',
}

export const analyticsRateLimitConfig = {
	windowMs: 60 * 1000, // 1 minute
	max: 120, // Limit each IP to 120 analytics events per minute
}
