import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { sendEmail } from '../../src/services/emailService'
import { API_URL } from '../../src/constants/env'

vi.mock('axios')

describe('emailService', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('sendEmail', () => {
		it('should send email with correct data', async () => {
			const mockResponse = {
				data: { success: true, messageId: 'test-id' },
			}
			vi.mocked(axios.post).mockResolvedValue(mockResponse)

			const emailData = {
				from: 'test@example.com',
				message: 'Test message',
				project: 'Test Project',
			}

			const result = await sendEmail(emailData)

			expect(axios.post).toHaveBeenCalledWith(
				`${API_URL}/send-email`,
				emailData
			)
			expect(result).toEqual(mockResponse)
		})

		it('should use correct API endpoint', async () => {
			const mockResponse = { data: { success: true } }
			vi.mocked(axios.post).mockResolvedValue(mockResponse)

			await sendEmail({
				from: 'test@example.com',
				message: 'Test',
				project: 'Test',
			})

			expect(axios.post).toHaveBeenCalledWith(
				`${API_URL}/send-email`,
				expect.any(Object)
			)
		})

		it('should handle successful response', async () => {
			const mockResponse = {
				data: {
					success: true,
					data: {
						messageId: 'msg-123',
						accepted: ['recipient@example.com'],
					},
				},
			}
			vi.mocked(axios.post).mockResolvedValue(mockResponse)

			const result = await sendEmail({
				from: 'sender@example.com',
				message: 'Hello',
				project: 'Greeting',
			})

			expect(result.data.success).toBe(true)
			expect(result.data.data).toHaveProperty('messageId')
		})

		it('should handle error response', async () => {
			const error = new Error('Network error')
			vi.mocked(axios.post).mockRejectedValue(error)

			await expect(
				sendEmail({
					from: 'test@example.com',
					message: 'Test',
					project: 'Test',
				})
			).rejects.toThrow('Network error')
		})

		it('should pass all email data fields', async () => {
			vi.mocked(axios.post).mockResolvedValue({ data: {} })

			const emailData = {
				from: 'user@example.com',
				message: 'Detailed test message',
				project: 'Important Project',
			}

			await sendEmail(emailData)

			const callArgs = vi.mocked(axios.post).mock.calls[0]
			expect(callArgs[1]).toEqual(emailData)
			expect(callArgs[1]).toHaveProperty('from', 'user@example.com')
			expect(callArgs[1]).toHaveProperty('message', 'Detailed test message')
			expect(callArgs[1]).toHaveProperty('project', 'Important Project')
		})

		it('should handle special characters in email data', async () => {
			vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })

			const emailData = {
				from: 'test@example.com',
				message: 'Message with <html> & "special" chars',
				project: 'Test & Demo',
			}

			await sendEmail(emailData)

			expect(axios.post).toHaveBeenCalledWith(
				`${API_URL}/send-email`,
				emailData
			)
		})

		it('should return axios response object', async () => {
			const mockResponse = {
				data: { success: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {},
			}
			vi.mocked(axios.post).mockResolvedValue(mockResponse)

			const result = await sendEmail({
				from: 'test@example.com',
				message: 'Test',
				project: 'Test',
			})

			expect(result).toHaveProperty('data')
			expect(result).toHaveProperty('status')
		})
	})
})
