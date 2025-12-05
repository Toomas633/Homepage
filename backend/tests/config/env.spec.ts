import { describe, it, expect, beforeAll } from 'vitest'
import { config, rateLimitConfig } from '../../src/config/env.js'

describe('Environment Configuration', () => {
	// Note: These tests run after the module has already been loaded by setup.ts
	// We test the configuration parsing, not the validation logic
	// The validation runs at module load time and cannot be easily tested in isolation

	beforeAll(() => {
		const requiredVars = [
			'EMAIL_HOST',
			'EMAIL_PORT',
			'EMAIL_USER',
			'EMAIL_PASS',
			'EMAIL_TO',
			'EMAIL_TLS',
			'ALLOWED_ORIGINS',
		]

		for (const varName of requiredVars) {
			if (!process.env[varName]) {
				throw new Error(`Test setup error: ${varName} not set in environment`)
			}
		}
	})

	describe('Configuration Object', () => {
		it('should export a valid config object with all sections', () => {
			expect(config).toBeDefined()
			expect(config.email).toBeDefined()
			expect(config.server).toBeDefined()
			expect(config.allowedOrigins).toBeDefined()
		})

		it('should correctly parse email configuration from environment', () => {
			expect(config.email.host).toBe(process.env.EMAIL_HOST)
			expect(config.email.user).toBe(process.env.EMAIL_USER)
			expect(config.email.password).toBe(process.env.EMAIL_PASS)
			expect(config.email.to).toBe(process.env.EMAIL_TO)
		})

		it('should parse EMAIL_TLS as boolean true when set to "true"', () => {
			expect(config.email.requireTLS).toBe(true)
			expect(typeof config.email.requireTLS).toBe('boolean')
		})

		it('should parse EMAIL_PORT as number', () => {
			expect(typeof config.email.port).toBe('number')
			expect(config.email.port).toBe(Number(process.env.EMAIL_PORT))
			expect(config.email.port).toBeGreaterThan(0)
		})

		it('should have correct server port configuration', () => {
			expect(config.server.port).toBe(3000)
			expect(typeof config.server.port).toBe('number')
		})

		it('should parse ALLOWED_ORIGINS as array', () => {
			expect(Array.isArray(config.allowedOrigins.origins)).toBe(true)
			expect(config.allowedOrigins.origins.length).toBeGreaterThan(0)

			const expected = process.env.ALLOWED_ORIGINS?.split(',') || []
			expect(config.allowedOrigins.origins).toEqual(expected)
		})
	})

	describe('Rate Limit Configuration', () => {
		it('should export rate limit configuration', () => {
			expect(rateLimitConfig).toBeDefined()
			expect(rateLimitConfig.max).toBeDefined()
			expect(rateLimitConfig.windowMs).toBeDefined()
		})

		it('should have correct rate limit values', () => {
			expect(rateLimitConfig.max).toBe(10)
			expect(rateLimitConfig.windowMs).toBe(15 * 60 * 1000) // 15 minutes in milliseconds
		})

		it('should have rate limit message', () => {
			expect(rateLimitConfig.message).toBeDefined()
			expect(typeof rateLimitConfig.message).toBe('string')
		})
	})
})
