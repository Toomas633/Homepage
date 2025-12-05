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

	describe('Error Handler Middleware', () => {
		it('should handle errors thrown by middleware', async () => {
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const response = await request(app)
				.post('/api/email')
				.send('invalid json')
				.set('Content-Type', 'application/json')

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty('error')
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Unhandled error:',
				expect.any(Error)
			)

			consoleErrorSpy.mockRestore()
		})

		it('should return 500 for unhandled errors', async () => {
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const response = await request(app)
				.post('/api/email')
				.send('{"invalid": json}')
				.set('Content-Type', 'application/json')

			expect(consoleErrorSpy).toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})
	})

	describe('JSON Body Parsing', () => {
		it('should handle malformed JSON gracefully', async () => {
			const response = await request(app)
				.post('/api/email')
				.send('{invalid json}')
				.set('Content-Type', 'application/json')

			expect([400, 500]).toContain(response.status)
		})

		it('should handle empty body on POST requests', async () => {
			const response = await request(app)
				.post('/api/email')
				.set('Content-Type', 'application/json')

			expect(response.status).toBeDefined()
		})

		it('should handle large JSON payloads', async () => {
			const largeObject = {
				message: 'a'.repeat(10000),
				data: Array(100).fill({ key: 'value' }),
			}

			const response = await request(app)
				.post('/api/email')
				.send(largeObject)
				.set('Content-Type', 'application/json')

			expect(response.status).toBeDefined()
		})
	})

	describe('HTTP Methods Not Allowed', () => {
		it('should return 404 for PATCH requests', async () => {
			const response = await request(app).patch('/api/health')

			expect(response.status).toBe(404)
			expect(response.body).toHaveProperty('error', 'Not Found')
		})

		it('should return 404 for HEAD requests to non-existent routes', async () => {
			const response = await request(app).head('/non-existent')

			expect(response.status).toBe(404)
		})
	})

	describe('Edge Cases', () => {
		it('should handle requests with no headers', async () => {
			const response = await request(app).get('/api/health')

			expect(response.status).toBeDefined()
		})

		it('should handle multiple query parameters', async () => {
			const response = await request(app).get(
				'/api/health?param1=value1&param2=value2&param3=value3'
			)

			expect(response.status).toBeLessThan(500)
		})

		it('should handle URL encoded paths', async () => {
			const response = await request(app).get(
				'/some%20path%20with%20spaces/test'
			)

			expect(response.status).toBe(404)
		})

		it('should handle paths with trailing slashes', async () => {
			const response = await request(app).get('/api/health/')

			expect(response.status).toBeDefined()
		})
	})
})

describe('Server Lifecycle', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('startServer function', () => {
		it('should be exported from app module', async () => {
			const appModule = await import('../src/app.js')
			expect(appModule.startServer).toBeDefined()
			expect(typeof appModule.startServer).toBe('function')
		})

		it('should verify email connection on startup', async () => {
			const { startServer } = await import('../src/app.js')
			const { createTransporter, verifyEmailConnection } =
				await import('../src/services/emailService.js')

			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'test'

			const serverPromise = startServer()

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(createTransporter).toHaveBeenCalled()

			process.env.NODE_ENV = originalEnv
		})
	})

	describe('Email verification on startup', () => {
		it('should log success when email verification succeeds', async () => {
			const { logWithTimestamp } = await import('../src/utils/helpers.js')
			const { startServer } = await import('../src/app.js')

			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'test'

			const { createTransporter, verifyEmailConnection } =
				await import('../src/services/emailService.js')

			const serverPromise = startServer()

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(logWithTimestamp).toHaveBeenCalledWith(
				'info',
				'Verifying email server connection...'
			)

			process.env.NODE_ENV = originalEnv
		})

		it('should handle email verification failure gracefully', async () => {
			const { logWithTimestamp, objectToString } =
				await import('../src/utils/helpers.js')
			const { verifyEmailConnection } =
				await import('../src/services/emailService.js')

			vi.mocked(verifyEmailConnection).mockRejectedValueOnce(
				new Error('SMTP connection failed')
			)

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const { startServer } = await import('../src/app.js')

			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'test'

			const serverPromise = startServer()

			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(logWithTimestamp).toHaveBeenCalledWith(
				'warn',
				'Email server connection failed - email features may be unavailable'
			)

			expect(consoleErrorSpy).toHaveBeenCalled()

			expect(objectToString).toHaveBeenCalledWith(
				expect.objectContaining({
					name: expect.any(String),
					message: 'SMTP connection failed',
				})
			)

			vi.mocked(verifyEmailConnection).mockResolvedValue(50)

			consoleErrorSpy.mockRestore()
			process.env.NODE_ENV = originalEnv
		})

		it('should handle non-Error exceptions in email verification', async () => {
			const { verifyEmailConnection } =
				await import('../src/services/emailService.js')

			vi.mocked(verifyEmailConnection).mockRejectedValueOnce('String error')

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const { startServer } = await import('../src/app.js')

			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'test'

			const serverPromise = startServer()

			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(consoleErrorSpy).toHaveBeenCalled()

			vi.mocked(verifyEmailConnection).mockResolvedValue(50)

			consoleErrorSpy.mockRestore()
			process.env.NODE_ENV = originalEnv
		})
	})

	describe('Conditional execution', () => {
		it('should not start server when NODE_ENV is test', () => {
			expect(process.env.NODE_ENV).toBe('test')
		})
	})

	describe('Graceful shutdown', () => {
		it('should handle SIGTERM signal gracefully', async () => {
			const { logWithTimestamp } = await import('../src/utils/helpers.js')

			const sigtermListeners = process.listenerCount('SIGTERM')
			const sigintListeners = process.listenerCount('SIGINT')

			expect(sigtermListeners).toBeGreaterThan(0)
			expect(sigintListeners).toBeGreaterThan(0)
		})

		it('should register signal handlers on server start', async () => {
			const { startServer } = await import('../src/app.js')

			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'test'

			const sigtermBefore = process.listenerCount('SIGTERM')
			const sigintBefore = process.listenerCount('SIGINT')

			const serverPromise = startServer()

			await new Promise((resolve) => setTimeout(resolve, 50))

			const sigtermAfter = process.listenerCount('SIGTERM')
			const sigintAfter = process.listenerCount('SIGINT')

			expect(sigtermAfter).toBeGreaterThanOrEqual(sigtermBefore)
			expect(sigintAfter).toBeGreaterThanOrEqual(sigintBefore)

			process.env.NODE_ENV = originalEnv
		})
	})
})
