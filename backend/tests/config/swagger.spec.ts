import { describe, it, expect } from 'vitest'
import { swaggerSpec } from '../../src/config/swagger.js'

describe('Swagger Configuration', () => {
	describe('Swagger Spec', () => {
		it('should export a valid swagger spec object', () => {
			expect(swaggerSpec).toBeDefined()
			expect(typeof swaggerSpec).toBe('object')
		})

		it('should have OpenAPI info section', () => {
			expect(swaggerSpec.info.title).toBeDefined()
			expect(swaggerSpec.info.version).toBeDefined()
			expect(swaggerSpec.info.description).toBeDefined()
		})

		it('should have correct API title', () => {
			expect(swaggerSpec.info.title).toContain("Toomas633's Dungeon API")
		})

		it('should have valid version format', () => {
			expect(swaggerSpec.info.version).toMatch(/^\d+\.\d+\.\d+$/)
		})

		it('should have paths defined', () => {
			expect(swaggerSpec.paths).toBeDefined()
			expect(typeof swaggerSpec.paths).toBe('object')
		})

		it('should have health endpoint path', () => {
			expect(swaggerSpec.paths?.['/api/health']).toBeDefined()
		})

		it('should have email endpoint path', () => {
			expect(swaggerSpec.paths?.['/api/send-email']).toBeDefined()
		})

		it('should define health endpoint GET method', () => {
			const healthPath = swaggerSpec.paths?.['/api/health']
			expect(healthPath?.get).toBeDefined()
		})

		it('should define email endpoint POST method', () => {
			const emailPath = swaggerSpec.paths?.['/api/send-email']
			expect(emailPath?.post).toBeDefined()
		})

		it('should have components/schemas defined', () => {
			expect(swaggerSpec.components?.schemas).toBeDefined()
		})

		it('should have HealthResponse schema', () => {
			expect(swaggerSpec.components?.schemas?.HealthResponse).toBeDefined()
		})

		it('should have EmailRequest schema', () => {
			expect(swaggerSpec.components?.schemas?.EmailRequest).toBeDefined()
		})

		it('should have EmailResponse schema', () => {
			expect(swaggerSpec.components?.schemas?.EmailResponse).toBeDefined()
		})

		it('should have ErrorResponse schema', () => {
			expect(swaggerSpec.components?.schemas?.ErrorResponse).toBeDefined()
		})

		it('should have valid OpenAPI version', () => {
			expect(swaggerSpec.openapi).toBeDefined()
			expect(swaggerSpec.openapi).toMatch(/^3\.\d+\.\d+$/)
		})

		it('should have proper schema structure for email request', () => {
			const emailSchema = swaggerSpec.components?.schemas?.EmailRequest
			expect(emailSchema).toBeDefined()
			if (emailSchema && 'type' in emailSchema) {
				expect(emailSchema.type).toBe('object')
				expect(emailSchema.required).toBeDefined()
				expect(emailSchema.required).toContain('from')
				expect(emailSchema.required).toContain('message')
				expect(emailSchema.required).toContain('project')
			}
		})

		it('should have proper schema properties for email request', () => {
			const emailSchema = swaggerSpec.components?.schemas?.EmailRequest
			expect(emailSchema).toBeDefined()
			if (emailSchema && 'properties' in emailSchema) {
				expect(emailSchema.properties).toBeDefined()
				expect(emailSchema.properties.from).toBeDefined()
				expect(emailSchema.properties.message).toBeDefined()
				expect(emailSchema.properties.project).toBeDefined()
			}
		})

		it('should have health endpoint with 200 response defined', () => {
			const healthPath = swaggerSpec.paths?.['/api/health']
			expect(healthPath?.get?.responses?.['200']).toBeDefined()
		})

		it('should have email endpoint with success and error responses', () => {
			const emailPath = swaggerSpec.paths?.['/api/send-email']
			expect(emailPath?.post?.responses?.['200']).toBeDefined()
			expect(emailPath?.post?.responses?.['400']).toBeDefined()
			expect(emailPath?.post?.responses?.['500']).toBeDefined()
		})
	})
})
