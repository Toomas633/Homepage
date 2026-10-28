import rateLimit from 'express-rate-limit'
import { analyticsRateLimitConfig, rateLimitConfig } from '../config/env.js'

export const emailRateLimiter = rateLimit({
	windowMs: rateLimitConfig.windowMs,
	max: rateLimitConfig.max,
	message: rateLimitConfig.message,
	standardHeaders: true,
	legacyHeaders: false,
})

export const healthRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 60, // Limit each IP to 60 requests per minute
	message:
		'Too many health check requests from this IP, please try again later',
	standardHeaders: true,
	legacyHeaders: false,
})

export const analyticsRateLimiter = rateLimit({
	windowMs: analyticsRateLimitConfig.windowMs,
	max: analyticsRateLimitConfig.max,
	message: 'Too many analytics events from this IP, please try again later',
	standardHeaders: true,
	legacyHeaders: false,
})
