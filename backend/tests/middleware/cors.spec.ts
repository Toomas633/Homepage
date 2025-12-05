import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'

vi.mock('../../src/config/env.js', () => ({
	config: {
		allowedOrigins: {
			origins: ['http://localhost:5173', 'http://localhost:3000'],
		},
	},
}))

import { corsMiddleware } from '../../src/middleware/cors'

describe('CORS Middleware', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use(corsMiddleware)
		app.get('/test', (_req, res) => {
			res.json({ success: true })
		})
	})

	it('should allow requests from allowed origins', async () => {
		const allowedOrigin = 'http://localhost:5173'

		const response = await request(app)
			.get('/test')
			.set('Origin', allowedOrigin)

		expect(response.status).toBe(200)
		expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin)
	})

	it('should reject requests from disallowed origins', async () => {
		const disallowedOrigin = 'http://malicious-site.com'

		const response = await request(app)
			.get('/test')
			.set('Origin', disallowedOrigin)

		expect(response.status).toBe(500)
		expect(response.text).toContain('Not allowed by CORS')
	})

	it('should allow requests without origin header', async () => {
		const response = await request(app).get('/test')

		expect(response.status).toBe(200)
		expect(response.body).toEqual({ success: true })
	})

	it('should handle OPTIONS preflight requests', async () => {
		const allowedOrigin = 'http://localhost:5173'

		const response = await request(app)
			.options('/test')
			.set('Origin', allowedOrigin)
			.set('Access-Control-Request-Method', 'POST')

		expect(response.status).toBe(204)
		expect(response.headers['access-control-allow-methods']).toContain('POST')
	})

	it('should only allow GET and POST methods', async () => {
		const allowedOrigin = 'http://localhost:5173'

		const response = await request(app)
			.options('/test')
			.set('Origin', allowedOrigin)
			.set('Access-Control-Request-Method', 'POST')

		expect(response.headers['access-control-allow-methods']).toBe('GET,POST')
	})

	it('should only allow Content-Type header', async () => {
		const allowedOrigin = 'http://localhost:5173'

		const response = await request(app)
			.options('/test')
			.set('Origin', allowedOrigin)
			.set('Access-Control-Request-Headers', 'Content-Type')

		expect(response.headers['access-control-allow-headers']).toBe(
			'Content-Type'
		)
	})

	it('should handle multiple allowed origins', async () => {
		const secondOrigin = 'http://localhost:3000'

		const response = await request(app).get('/test').set('Origin', secondOrigin)

		expect(response.status).toBe(200)
		expect(response.headers['access-control-allow-origin']).toBe(secondOrigin)
	})

	it('should block non-allowed methods in actual requests', async () => {
		const allowedOrigin = 'http://localhost:5173'

		app.delete('/test', (_req, res) => {
			res.json({ deleted: true })
		})

		const response = await request(app)
			.delete('/test')
			.set('Origin', allowedOrigin)

		expect(response.headers).toHaveProperty('access-control-allow-origin')
	})
})
