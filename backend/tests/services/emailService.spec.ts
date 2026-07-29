import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import {
	createTransporter,
	verifyEmailConnection,
	sendEmail,
	getEmailHealth,
	resetEmailHealthCache,
} from '../../src/services/emailService'
import { config } from '../../src/config/env.js'

vi.mock('nodemailer')

const createDelayedVerify = (delay: number) => () =>
	new Promise<true>((resolve) => {
		setTimeout(() => resolve(true), delay)
	})

describe('emailService', () => {
	describe('createTransporter', () => {
		it('should create a transporter with correct configuration', () => {
			const mockTransporter = {
				verify: vi.fn(),
				sendMail: vi.fn(),
			} as unknown as Transporter

			vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter)

			const transporter = createTransporter()

			expect(nodemailer.createTransport).toHaveBeenCalledWith({
				pool: true,
				maxConnections: 1,
				maxMessages: Infinity,
				host: config.email.host,
				port: config.email.port,
				requireTLS: config.email.requireTLS,
				connectionTimeout: 10000,
				greetingTimeout: 10000,
				socketTimeout: 20000,
				auth: {
					user: config.email.user,
					pass: config.email.password,
				},
				tls: {
					servername: config.email.host,
					rejectUnauthorized: config.email.tlsRejectUnauthorized,
				},
			})
			expect(transporter).toBe(mockTransporter)
		})
	})

	describe('verifyEmailConnection', () => {
		let mockTransporter: Transporter

		beforeEach(() => {
			mockTransporter = {
				verify: vi.fn().mockResolvedValue(true),
			} as unknown as Transporter
		})

		it('should verify email connection successfully', async () => {
			const responseTime = await verifyEmailConnection(mockTransporter)

			expect(mockTransporter.verify).toHaveBeenCalled()
			expect(responseTime).toBeGreaterThanOrEqual(0)
			expect(typeof responseTime).toBe('number')
		})

		it('should measure and return connection response time', async () => {
			vi.mocked(mockTransporter.verify).mockImplementation(
				createDelayedVerify(50)
			)

			const responseTime = await verifyEmailConnection(mockTransporter)

			expect(responseTime).toBeGreaterThanOrEqual(10)
		})

		it('should throw error when verification fails', async () => {
			const error = new Error('Connection failed')
			vi.mocked(mockTransporter.verify).mockRejectedValue(error)

			await expect(verifyEmailConnection(mockTransporter)).rejects.toThrow(
				'Connection failed'
			)
		})

		describe('retry behaviour', () => {
			beforeEach(() => {
				vi.useFakeTimers()
			})

			afterEach(() => {
				vi.useRealTimers()
			})

			it('should succeed on a subsequent attempt after a transient failure', async () => {
				vi.mocked(mockTransporter.verify)
					.mockRejectedValueOnce(new Error('Transient error'))
					.mockResolvedValueOnce(true)

				const promise = verifyEmailConnection(mockTransporter, 5000, 1)
				await vi.advanceTimersByTimeAsync(1500)

				const responseTime = await promise

				expect(mockTransporter.verify).toHaveBeenCalledTimes(2)
				expect(typeof responseTime).toBe('number')
			})

			it('should exhaust all retries and throw the last error', async () => {
				const error = new Error('Persistent failure')
				vi.mocked(mockTransporter.verify).mockRejectedValue(error)

				const promise = verifyEmailConnection(mockTransporter, 5000, 2)
				// Attach the handler before advancing timers so the rejection is
				// never left unhandled between the promise settling and the assertion.
				const assertion = expect(promise).rejects.toThrow('Persistent failure')
				await vi.advanceTimersByTimeAsync(3000)
				await assertion
				expect(mockTransporter.verify).toHaveBeenCalledTimes(3)
			})

			it('should make exactly one attempt when maxRetries is 0', async () => {
				const error = new Error('Connection failed')
				vi.mocked(mockTransporter.verify).mockRejectedValue(error)

				await expect(
					verifyEmailConnection(mockTransporter, 5000, 0)
				).rejects.toThrow('Connection failed')
				expect(mockTransporter.verify).toHaveBeenCalledTimes(1)
			})
		})
	})

	describe('sendEmail', () => {
		let mockTransporter: Transporter

		beforeEach(() => {
			vi.clearAllMocks()
			resetEmailHealthCache()
			mockTransporter = {
				verify: vi.fn().mockResolvedValue(true),
				sendMail: vi.fn().mockResolvedValue({
					messageId: 'test-message-id',
					accepted: ['test@example.com'],
				}),
				close: vi.fn(),
			} as unknown as Transporter

			vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter)
		})

		it('should send email with correct parameters', async () => {
			const emailParams = {
				from: 'sender@example.com',
				message: 'Test message content',
				project: 'Test Project',
			}

			const result = await sendEmail(emailParams)

			expect(mockTransporter.sendMail).toHaveBeenCalledWith({
				from: config.email.user,
				to: config.email.to,
				subject: 'Test Project',
				text: 'Test message content',
				replyTo: 'sender@example.com',
			})
			expect(result).toHaveProperty('messageId', 'test-message-id')
		})

		it('should not call verify before sending email', async () => {
			await sendEmail({
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			})

			expect(mockTransporter.verify).not.toHaveBeenCalled()
			expect(mockTransporter.sendMail).toHaveBeenCalled()
		})

		it('should throw error when sending fails on all attempts', async () => {
			const error = new Error('Send failed')
			vi.mocked(mockTransporter.sendMail).mockRejectedValue(error)

			const emailParams = {
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			}

			await expect(sendEmail(emailParams)).rejects.toThrow('Send failed')
		})

		it('should handle all email parameters correctly', async () => {
			const emailParams = {
				from: 'user@example.com',
				message: 'This is a test message with special characters: <>&"',
				project: 'Important Project',
			}

			await sendEmail(emailParams)

			expect(mockTransporter.sendMail).toHaveBeenCalledWith({
				from: config.email.user,
				to: config.email.to,
				subject: 'Important Project',
				text: 'This is a test message with special characters: <>&"',
				replyTo: 'user@example.com',
			})
		})

		describe('retry behaviour', () => {
			beforeEach(() => {
				vi.useFakeTimers()
			})

			afterEach(() => {
				vi.useRealTimers()
			})

			it('should succeed on a subsequent attempt after a transient failure', async () => {
				vi.mocked(mockTransporter.sendMail)
					.mockRejectedValueOnce(new Error('Transient TLS error'))
					.mockResolvedValueOnce({
						messageId: 'test-message-id',
						accepted: ['test@example.com'],
					})

				const promise = sendEmail({
					from: 'sender@example.com',
					message: 'Test message',
					project: 'Test',
				})
				await vi.advanceTimersByTimeAsync(1500)

				const result = await promise

				// The pooled connection is created once and reused across retries.
				expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
				expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2)
				expect(result).toHaveProperty('messageId', 'test-message-id')
			})

			it('should exhaust all retries and throw the last error', async () => {
				const error = new Error('Persistent TLS failure')
				vi.mocked(mockTransporter.sendMail).mockRejectedValue(error)

				const promise = sendEmail({
					from: 'sender@example.com',
					message: 'Test message',
					project: 'Test',
				})
				const assertion = expect(promise).rejects.toThrow(
					'Persistent TLS failure'
				)
				await vi.advanceTimersByTimeAsync(3000)
				await assertion

				// One shared connection, retried three times.
				expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
				expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3)
			})
		})
	})

	describe('getEmailHealth', () => {
		let mockTransporter: Transporter

		beforeEach(() => {
			vi.clearAllMocks()
			resetEmailHealthCache()
			mockTransporter = {
				verify: vi.fn().mockResolvedValue(true),
				close: vi.fn(),
			} as unknown as Transporter
			vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter)
		})

		it('should report connected without closing the shared connection', async () => {
			const result = await getEmailHealth()

			expect(result.status).toBe('connected')
			expect(result.responseTime).toMatch(/\d+ms/)
			expect(mockTransporter.verify).toHaveBeenCalledTimes(1)
			// The connection is kept alive for the app lifetime, not closed per check.
			expect(mockTransporter.close).not.toHaveBeenCalled()
		})

		it('should report disconnected with the error message on failure', async () => {
			vi.mocked(mockTransporter.verify).mockRejectedValue(
				new Error('SMTP connection timeout')
			)

			const result = await getEmailHealth()

			expect(result.status).toBe('disconnected')
			expect(result.error).toBe('SMTP connection timeout')
			expect(mockTransporter.close).not.toHaveBeenCalled()
		})

		it('should cache the result and not open a new SMTP login within the TTL', async () => {
			await getEmailHealth()
			await getEmailHealth()
			await getEmailHealth()

			// Only one real verify/login despite multiple calls.
			expect(mockTransporter.verify).toHaveBeenCalledTimes(1)
			expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
		})

		it('should de-duplicate concurrent checks into a single login', async () => {
			const [a, b, c] = await Promise.all([
				getEmailHealth(),
				getEmailHealth(),
				getEmailHealth(),
			])

			expect(a).toEqual(b)
			expect(b).toEqual(c)
			expect(mockTransporter.verify).toHaveBeenCalledTimes(1)
		})

		it('should re-check after the cache is reset', async () => {
			await getEmailHealth()
			resetEmailHealthCache()
			await getEmailHealth()

			expect(mockTransporter.verify).toHaveBeenCalledTimes(2)
		})
	})
})
