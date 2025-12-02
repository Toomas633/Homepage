import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import type { Transporter } from 'nodemailer'
import healthRouter from '../../src/routes/health'
import * as emailService from '../../src/services/emailService'

describe('Health Route', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use(healthRouter)
		vi.clearAllMocks()
	})

	it('should return healthy status when email connection is successful', async () => {
		vi.spyOn(emailService, 'createTransporter').mockReturnValue(
			{} as Transporter
		)
		vi.spyOn(emailService, 'verifyEmailConnection').mockResolvedValue(50)

		const response = await request(app).get('/api/health')

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('status', 'healthy')
		expect(response.body).toHaveProperty('timestamp')
		expect(response.body.email).toHaveProperty('status', 'connected')
		expect(response.body.email).toHaveProperty('responseTime', '50ms')
	})

	it('should return unhealthy status when email connection fails', async () => {
		vi.spyOn(emailService, 'createTransporter').mockReturnValue(
			{} as Transporter
		)
		vi.spyOn(emailService, 'verifyEmailConnection').mockRejectedValue(
			new Error('Connection failed')
		)

		const response = await request(app).get('/api/health')

		expect(response.status).toBe(503)
		expect(response.body).toHaveProperty('status', 'unhealthy')
		expect(response.body).toHaveProperty('timestamp')
		expect(response.body.email).toHaveProperty('status', 'disconnected')
		expect(response.body.email).toHaveProperty('error', 'Connection failed')
	})

	it('should include timestamp in ISO format', async () => {
		vi.spyOn(emailService, 'createTransporter').mockReturnValue(
			{} as Transporter
		)
		vi.spyOn(emailService, 'verifyEmailConnection').mockResolvedValue(50)

		const response = await request(app).get('/api/health')

		expect(response.body.timestamp).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
		)
	})
})
