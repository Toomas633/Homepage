import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express, { Request, Response, NextFunction } from 'express'
import emailRouter from '../../src/routes/email'
import * as emailService from '../../src/services/emailService'

// Mock the rate limiter to avoid rate limiting in tests
vi.mock('../middleware/rateLimiter.js', () => ({
	emailRateLimiter: (_req: Request, _res: Response, next: NextFunction) =>
		next(),
}))

describe('Email Route', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use(express.json())
		app.use(emailRouter)
		vi.clearAllMocks()
	})

	describe('POST /send-email', () => {
		it('should send email successfully with valid data', async () => {
			const mockInfo = {
				messageId: 'test-message-id',
				accepted: ['recipient@example.com'],
			}

			vi.spyOn(emailService, 'sendEmail').mockResolvedValue(mockInfo)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test Project',
			})

			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('success', true)
			expect(response.body).toHaveProperty('data', mockInfo)
			expect(emailService.sendEmail).toHaveBeenCalledWith({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test Project',
			})
		})

		it('should return 500 when email sending fails', async () => {
			const error = new Error('SMTP connection failed')
			vi.spyOn(emailService, 'sendEmail').mockRejectedValue(error)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test Project',
			})

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty('success', false)
			expect(response.body).toHaveProperty('message', 'Error sending email')
			expect(response.body).toHaveProperty('error')
			expect(response.body.error).toContain('SMTP connection failed')
		})

		it('should include error details in response', async () => {
			const error = new Error('Connection timeout')
			error.name = 'TimeoutError'
			vi.spyOn(emailService, 'sendEmail').mockRejectedValue(error)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test Project',
			})

			expect(response.status).toBe(500)
			expect(response.body.error).toContain('TimeoutError')
			expect(response.body.error).toContain('Connection timeout')
		})

		it('should handle all required fields', async () => {
			const mockInfo = { messageId: 'test-id' }
			vi.spyOn(emailService, 'sendEmail').mockResolvedValue(mockInfo)

			const emailData = {
				from: 'user@example.com',
				message: 'This is a comprehensive test message',
				project: 'Important Project Name',
			}

			const response = await request(app)
				.post('/api/send-email')
				.send(emailData)

			expect(response.status).toBe(200)
			expect(emailService.sendEmail).toHaveBeenCalledWith(emailData)
		})

		it('should handle special characters in message', async () => {
			const mockInfo = { messageId: 'test-id' }
			vi.spyOn(emailService, 'sendEmail').mockResolvedValue(mockInfo)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Message with <html> tags & special "characters"',
				project: 'Test',
			})

			expect(response.status).toBe(200)
			expect(emailService.sendEmail).toHaveBeenCalledWith({
				from: 'sender@example.com',
				message: 'Message with <html> tags & special "characters"',
				project: 'Test',
			})
		})

		it('should handle long messages', async () => {
			const mockInfo = { messageId: 'test-id' }
			vi.spyOn(emailService, 'sendEmail').mockResolvedValue(mockInfo)

			const longMessage = 'A'.repeat(5000)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: longMessage,
				project: 'Test',
			})

			expect(response.status).toBe(200)
		})

		it('should handle non-Error exceptions', async () => {
			vi.spyOn(emailService, 'sendEmail').mockRejectedValue('String error')

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			})

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty('success', false)
			expect(response.body.error).toBe('Unknown error')
		})

		it('should include error stack trace in response', async () => {
			const error = new Error('Detailed error')
			vi.spyOn(emailService, 'sendEmail').mockRejectedValue(error)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			})

			expect(response.status).toBe(500)
			expect(response.body.error).toContain('stack:')
		})

		it('should return messageId in successful response', async () => {
			const mockInfo = {
				messageId: 'unique-message-id-12345',
				accepted: ['test@example.com'],
				response: '250 OK',
			}
			vi.spyOn(emailService, 'sendEmail').mockResolvedValue(mockInfo)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			})

			expect(response.status).toBe(200)
			expect(response.body.data).toHaveProperty(
				'messageId',
				'unique-message-id-12345'
			)
		})

		it('should handle authentication errors', async () => {
			const error = new Error('Authentication failed')
			error.name = 'AuthenticationError'
			vi.spyOn(emailService, 'sendEmail').mockRejectedValue(error)

			const response = await request(app).post('/api/send-email').send({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			})

			expect(response.status).toBe(500)
			expect(response.body.error).toContain('AuthenticationError')
			expect(response.body.error).toContain('Authentication failed')
		})
	})
})
