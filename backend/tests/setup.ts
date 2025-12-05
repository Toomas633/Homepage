import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
	process.env.NODE_ENV = 'test'
	process.env.EMAIL_HOST = 'smtp.test.com'
	process.env.EMAIL_USER = 'test@example.com'
	process.env.EMAIL_PASS = 'test-password'
	process.env.EMAIL_TO = 'recipient@example.com'
	process.env.EMAIL_PORT = '587'
	process.env.EMAIL_TLS = 'true'
	process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:3000'
})

afterAll(() => {
	// Cleanup code after all tests
})
