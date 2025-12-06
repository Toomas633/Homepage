import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../../src/config/swagger.js'

describe('Swagger Documentation Routes', () => {
	const app = express()

	// Setup Swagger routes for testing
	app.use('/api/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
	app.get('/api/swagger-ui.json', (_req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	describe('GET /api/swagger-ui.json', () => {
		it('should return OpenAPI specification as JSON', async () => {
			const response = await request(app).get('/api/swagger-ui.json')

			expect(response.status).toBe(200)
			expect(response.headers['content-type']).toContain('application/json')
			expect(response.body).toHaveProperty('openapi')
			expect(response.body).toHaveProperty('info')
			expect(response.body).toHaveProperty('paths')
		})

		it('should have correct API metadata', async () => {
			const response = await request(app).get('/api/swagger-ui.json')

			expect(response.body.info.title).toBe("Toomas633's Dungeon API")
			expect(response.body.info.version).toBe('2.0.3')
			expect(response.body.openapi).toBe('3.0.0')
		})

		it('should document health endpoint', async () => {
			const response = await request(app).get('/api/swagger-ui.json')

			expect(response.body.paths).toHaveProperty('/api/health')
			expect(response.body.paths['/api/health']).toHaveProperty('get')
		})

		it('should document email endpoint', async () => {
			const response = await request(app).get('/api/swagger-ui.json')

			expect(response.body.paths).toHaveProperty('/api/send-email')
			expect(response.body.paths['/api/send-email']).toHaveProperty('post')
		})

		it('should include component schemas', async () => {
			const response = await request(app).get('/api/swagger-ui.json')

			expect(response.body.components).toHaveProperty('schemas')
			expect(response.body.components.schemas).toHaveProperty('HealthResponse')
			expect(response.body.components.schemas).toHaveProperty('EmailRequest')
			expect(response.body.components.schemas).toHaveProperty('EmailResponse')
			expect(response.body.components.schemas).toHaveProperty('ErrorResponse')
		})
	})

	describe('GET /api/swagger-ui', () => {
		it('should return Swagger UI HTML', async () => {
			const response = await request(app).get('/api/swagger-ui/')

			expect(response.status).toBe(200)
			expect(response.headers['content-type']).toContain('text/html')
			expect(response.text).toContain('swagger-ui')
		})
	})
})
