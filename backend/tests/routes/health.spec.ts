import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import healthRouter from '../../src/routes/health'
import * as emailService from '../../src/services/emailService'

describe('Health Route', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use('/api', healthRouter)
		vi.clearAllMocks()
	})

	it('should return healthy status when email connection is successful', async () => {
		const getSpy = vi.spyOn(emailService, 'getEmailHealth').mockResolvedValue({
			status: 'connected',
			responseTime: '50ms',
			checkedAt: Date.now(),
		})

		const response = await request(app).get('/api/health')

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('status', 'healthy')
		expect(response.body).toHaveProperty('timestamp')
		expect(response.body.email).toHaveProperty('status', 'connected')
		expect(response.body.email).toHaveProperty('responseTime', '50ms')
		expect(getSpy).toHaveBeenCalledTimes(1)
	})

	it('should return degraded status when email connection fails', async () => {
		const getSpy = vi.spyOn(emailService, 'getEmailHealth').mockResolvedValue({
			status: 'disconnected',
			error: 'Connection failed',
			checkedAt: Date.now(),
		})

		const response = await request(app).get('/api/health')

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('status', 'degraded')
		expect(response.body).toHaveProperty('timestamp')
		expect(response.body.email).toHaveProperty('status', 'disconnected')
		expect(response.body.email).toHaveProperty('error', 'Connection failed')
		expect(getSpy).toHaveBeenCalledTimes(1)
	})

	it('should include timestamp in ISO format', async () => {
		vi.spyOn(emailService, 'getEmailHealth').mockResolvedValue({
			status: 'connected',
			responseTime: '50ms',
			checkedAt: Date.now(),
		})

		const response = await request(app).get('/api/health')

		expect(response.body.timestamp).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
		)
	})
})
