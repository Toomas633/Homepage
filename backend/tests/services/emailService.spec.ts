import { describe, it, expect, vi, beforeEach } from 'vitest'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import {
	createTransporter,
	verifyEmailConnection,
	sendEmail,
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
				host: config.email.host,
				port: config.email.port,
				requireTLS: config.email.requireTLS,
				auth: {
					user: config.email.user,
					pass: config.email.password,
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
				createDelayedVerify(10)
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
	})

	describe('sendEmail', () => {
		let mockTransporter: Transporter

		beforeEach(() => {
			mockTransporter = {
				verify: vi.fn().mockResolvedValue(true),
				sendMail: vi.fn().mockResolvedValue({
					messageId: 'test-message-id',
					accepted: ['test@example.com'],
				}),
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

			expect(mockTransporter.verify).toHaveBeenCalled()
			expect(mockTransporter.sendMail).toHaveBeenCalledWith({
				from: config.email.user,
				to: config.email.to,
				subject: 'Test Project',
				text: 'Test message content',
				replyTo: 'sender@example.com',
			})
			expect(result).toHaveProperty('messageId', 'test-message-id')
		})

		it('should verify connection before sending email', async () => {
			const emailParams = {
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			}

			await sendEmail(emailParams)

			expect(mockTransporter.verify).toHaveBeenCalled()
			expect(mockTransporter.sendMail).toHaveBeenCalled()
		})

		it('should throw error when verification fails', async () => {
			const error = new Error('Verification failed')
			vi.mocked(mockTransporter.verify).mockRejectedValue(error)

			const emailParams = {
				from: 'sender@example.com',
				message: 'Test message',
				project: 'Test',
			}

			await expect(sendEmail(emailParams)).rejects.toThrow(
				'Verification failed'
			)
			expect(mockTransporter.sendMail).not.toHaveBeenCalled()
		})

		it('should throw error when sending fails', async () => {
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
	})
})
