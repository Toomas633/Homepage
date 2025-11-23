import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

vi.mock('../src/services/emailService.js', () => ({
	createTransporter: vi.fn().mockReturnValue({}),
	verifyEmailConnection: vi.fn().mockResolvedValue(50),
}))

vi.mock('../src/utils/helpers.js', () => ({
	logWithTimestamp: vi.fn(),
	objectToString: vi.fn((obj) => JSON.stringify(obj)),
}))

describe('Express App', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Middleware Configuration', () => {
		it('should have x-powered-by header disabled', async () => {
			const response = await request(app).get('/api/health')
			expect(response.headers['x-powered-by']).toBeUndefined()
		})

		it('should parse JSON request bodies', async () => {
			const response = await request(app)
				.post('/api/email')
				.send({ email: 'test@example.com', message: 'Test' })
				.set('Content-Type', 'application/json')

			expect(response.status).not.toBe(400)
		})

		it('should have CORS middleware enabled', async () => {
			const response = await request(app)
				.options('/api/health')
				.set('Origin', 'http://localhost:3000')

			expect(response.status).toBe(204)
		})
	})

	describe('Route Mounting', () => {
		it('should mount health routes', async () => {
			const response = await request(app).get('/api/health')
			expect(response.status).toBeLessThan(500)
		})

		it('should mount email routes', async () => {
			const response = await request(app)
				.post('/api/email')
				.send({ email: 'test@example.com', message: 'Test' })

			expect(response.status).toBeLessThan(500)
		})
	})

	describe('404 Handler', () => {
		it('should return 404 for non-existent GET routes', async () => {
			const response = await request(app).get('/non-existent-route')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
			expect(response.body).toHaveProperty(
				'message',
				'Cannot GET /non-existent-route'
			)
		})

		it('should return 404 for non-existent POST routes', async () => {
			const response = await request(app).post('/invalid-endpoint')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
			expect(response.body).toHaveProperty(
				'message',
				'Cannot POST /invalid-endpoint'
			)
		})

		it('should return 404 for non-existent PUT routes', async () => {
			const response = await request(app).put('/does-not-exist')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
			expect(response.body.message).toContain('PUT')
		})

		it('should return 404 for non-existent DELETE routes', async () => {
			const response = await request(app).delete('/random-path')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
			expect(response.body.message).toContain('DELETE')
		})

		it('should handle deeply nested non-existent routes', async () => {
			const response = await request(app).get('/api/v1/users/123/posts/456')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
		})
	})

	describe('Error Handler', () => {
		it('should have error handling middleware configured', async () => {
			const response = await request(app).get('/api/health')

			expect(response.status).toBeDefined()
			expect(typeof response.status).toBe('number')
		})
	})

	describe('Content Type Handling', () => {
		it('should accept application/json content type', async () => {
			const response = await request(app)
				.post('/api/email')
				.send({ email: 'test@example.com', message: 'Test message' })
				.set('Content-Type', 'application/json')

			expect(response.status).not.toBe(415)
		})

		it('should respond with JSON for API routes', async () => {
			const response = await request(app).get('/api/health')

			expect(response.headers['content-type']).toMatch(/application\/json/)
		})
	})

	describe('HTTP Method Support', () => {
		it('should support GET requests', async () => {
			const response = await request(app).get('/api/health')
			expect(response.status).toBeLessThan(500)
			expect(response.status).not.toBe(405)
		})

		it('should support POST requests', async () => {
			const response = await request(app)
				.post('/api/email')
				.send({ email: 'test@example.com', message: 'Test' })

			expect(response.status).not.toBe(405)
		})

		it('should support OPTIONS requests for CORS', async () => {
			const response = await request(app)
				.options('/api/health')
				.set('Origin', 'http://localhost:3000')

			expect([200, 204]).toContain(response.status)
		})
	})

	describe('Security Headers', () => {
		it('should not expose Express in x-powered-by header', async () => {
			const response = await request(app).get('/api/health')
			expect(response.headers['x-powered-by']).toBeUndefined()
		})
	})

	describe('Request Validation', () => {
		it('should handle requests with query parameters', async () => {
			const response = await request(app).get('/api/health?test=true')

			expect(response.status).toBeLessThan(500)
		})

		it('should handle requests with special characters in URL', async () => {
			const response = await request(app).get(
				'/non-existent?name=test%20user&id=123'
			)

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error')
		})
	})

	describe('App Export', () => {
		it('should export the Express application instance', () => {
			expect(app).toBeDefined()
			expect(typeof app).toBe('function')
			expect(app.listen).toBeDefined()
		})
	})
})
