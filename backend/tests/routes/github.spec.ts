import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import type { GitHubResponse } from '../../src/types/index.js'
import githubRouter from '../../src/routes/github'
import * as githubService from '../../src/services/githubService'

// Mock type that allows flexible test data structure
type MockGitHubData = GitHubResponse & Record<string, unknown>

describe('GitHub Route', () => {
	let app: express.Application

	beforeEach(() => {
		app = express()
		app.use(express.json())
		app.use('/api', githubRouter)
		vi.clearAllMocks()
	})

	describe('POST /github', () => {
		it('should fetch GitHub data successfully with valid repo', async () => {
			const mockData: MockGitHubData = {
				name: 'test-repo',
				description: 'Test repository',
				stars: 100,
				forks: 50,
				languages: [],
			}

			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				mockData
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('success', true)
			expect(response.body).toHaveProperty('data', mockData)
			expect(githubService.githubService.queryData).toHaveBeenCalledWith(
				'user/test-repo'
			)
		})

		it('should return 500 when GitHub API fails', async () => {
			const error = new Error('API rate limit exceeded')
			vi.spyOn(githubService.githubService, 'queryData').mockRejectedValue(
				error
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty('success', false)
			expect(response.body).toHaveProperty(
				'message',
				'Error fetching GitHub Data'
			)
			expect(response.body).toHaveProperty('error', 'API rate limit exceeded')
		})

		it('should handle repository not found error', async () => {
			const error = new Error('Repository not found')
			vi.spyOn(githubService.githubService, 'queryData').mockRejectedValue(
				error
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/non-existent-repo' })

			expect(response.status).toBe(500)
			expect(response.body.error).toBe('Repository not found')
		})

		it('should handle non-Error exceptions', async () => {
			vi.spyOn(githubService.githubService, 'queryData').mockRejectedValue(
				'String error'
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty('success', false)
			expect(response.body.error).toBe('Unknown error')
		})

		it('should pass correct repo parameter to service', async () => {
			const mockData: MockGitHubData = {
				name: 'homepage',
				languages: [],
			}
			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				mockData
			)

			await request(app)
				.post('/api/github')
				.send({ repo: 'Toomas633/homepage' })

			expect(githubService.githubService.queryData).toHaveBeenCalledWith(
				'Toomas633/homepage'
			)
		})

		it('should handle GitHub data with all fields', async () => {
			const completeData: MockGitHubData = {
				name: 'test-repo',
				fullName: 'user/test-repo',
				description: 'A complete test repository',
				stars: 250,
				forks: 75,
				watchers: 100,
				openIssues: 15,
				languages: [],
				topics: ['web', 'typescript', 'api'],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-12-01T00:00:00Z',
			}

			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				completeData
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(200)
			expect(response.body.data).toEqual(completeData)
		})

		it('should handle authentication errors', async () => {
			const error = new Error('Bad credentials')
			error.name = 'AuthenticationError'
			vi.spyOn(githubService.githubService, 'queryData').mockRejectedValue(
				error
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(500)
			expect(response.body.error).toBe('Bad credentials')
		})

		it('should handle network timeout errors', async () => {
			const error = new Error('Request timeout')
			error.name = 'TimeoutError'
			vi.spyOn(githubService.githubService, 'queryData').mockRejectedValue(
				error
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.status).toBe(500)
			expect(response.body).toHaveProperty(
				'message',
				'Error fetching GitHub Data'
			)
			expect(response.body.error).toBe('Request timeout')
		})

		it('should return JSON content type', async () => {
			const mockData: MockGitHubData = {
				name: 'test',
				languages: [],
			}
			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				mockData
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/test-repo' })

			expect(response.headers['content-type']).toMatch(/application\/json/)
		})

		it('should handle empty repo name', async () => {
			const mockData = null as unknown as GitHubResponse
			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				mockData
			)

			const response = await request(app).post('/api/github').send({ repo: '' })

			expect(response.status).toBe(200)
			expect(response.body.data).toBeNull()
		})

		it('should handle special characters in repo name', async () => {
			const mockData: MockGitHubData = {
				name: 'special-repo',
				languages: [],
			}
			vi.spyOn(githubService.githubService, 'queryData').mockResolvedValue(
				mockData
			)

			const response = await request(app)
				.post('/api/github')
				.send({ repo: 'user/repo-with-dashes_and_underscores' })

			expect(response.status).toBe(200)
			expect(githubService.githubService.queryData).toHaveBeenCalledWith(
				'user/repo-with-dashes_and_underscores'
			)
		})
	})
})
