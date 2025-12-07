import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RepoInfo } from '../../src/types/github'

const mockPost = vi.hoisted(() => vi.fn())

vi.mock('axios', () => ({
	default: {
		create: () => ({
			post: mockPost,
		}),
	},
}))

vi.mock('../../src/helpers/alertMixin', () => ({
	default: () => ({
		showErrorMessage: vi.fn(),
	}),
}))

import { getRepoInfo } from '../../src/services/githubService'

describe('GitHub Service', () => {
	beforeEach(() => {
		mockPost.mockClear()
	})

	describe('getRepoInfo', () => {
		it('should fetch repository information successfully', async () => {
			const mockRepoData: RepoInfo = {
				license: {
					key: 'mit',
					name: 'MIT License',
					node_id: 'MDc6TGljZW5zZTEz',
					spdx_id: 'MIT',
					url: 'https://api.github.com/licenses/mit',
				},
				languages: [
					{ name: 'TypeScript', count: 1000 },
					{ name: 'JavaScript', count: 500 },
				],
				latestRelease: 'v1.0.0',
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/repo')

			expect(result).toEqual(mockRepoData)
			expect(mockPost).toHaveBeenCalledWith('/github', {
				repo: 'owner/repo',
			})
		})

		it('should use correct API endpoint', async () => {
			const mockResponse = {
				data: {
					data: {
						languages: [],
					},
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			await getRepoInfo('testowner/testrepo')

			expect(mockPost).toHaveBeenCalledWith('/github', {
				repo: 'testowner/testrepo',
			})
		})

		it('should handle repository with no license', async () => {
			const mockRepoData: RepoInfo = {
				languages: [{ name: 'Python', count: 800 }],
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/repo-no-license')

			expect(result).toEqual(mockRepoData)
			expect(result?.license).toBeUndefined()
		})

		it('should handle repository with no release', async () => {
			const mockRepoData: RepoInfo = {
				languages: [{ name: 'Go', count: 600 }],
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/repo-no-release')

			expect(result).toEqual(mockRepoData)
			expect(result?.latestRelease).toBeUndefined()
		})

		it('should handle empty languages array', async () => {
			const mockRepoData: RepoInfo = {
				languages: [],
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/empty-repo')

			expect(result).toEqual(mockRepoData)
			expect(result?.languages).toHaveLength(0)
		})

		it('should return undefined on network error', async () => {
			const networkError = new Error('Network error')

			mockPost.mockRejectedValue(networkError)

			const result = await getRepoInfo('owner/repo')

			expect(result).toBeUndefined()
		})

		it('should return undefined on 404 error', async () => {
			const error404 = {
				response: {
					status: 404,
					data: { error: 'Repository not found' },
				},
			}

			mockPost.mockRejectedValue(error404)

			const result = await getRepoInfo('owner/nonexistent')

			expect(result).toBeUndefined()
		})

		it('should return undefined on 500 error', async () => {
			const error500 = {
				response: {
					status: 500,
					data: { error: 'Internal server error' },
				},
			}

			mockPost.mockRejectedValue(error500)

			const result = await getRepoInfo('owner/repo')

			expect(result).toBeUndefined()
		})

		it('should handle multiple languages correctly', async () => {
			const mockRepoData: RepoInfo = {
				languages: [
					{ name: 'TypeScript', count: 5000 },
					{ name: 'JavaScript', count: 3000 },
					{ name: 'HTML', count: 1000 },
					{ name: 'CSS', count: 500 },
				],
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/multi-lang-repo')

			expect(result?.languages).toHaveLength(4)
			expect(result?.languages[0].name).toBe('TypeScript')
			expect(result?.languages[0].count).toBe(5000)
		})

		it('should handle complete repository data', async () => {
			const mockRepoData: RepoInfo = {
				license: {
					key: 'gpl-3.0',
					name: 'GNU General Public License v3.0',
					node_id: 'MDc6TGljZW5zZTk=',
					spdx_id: 'GPL-3.0',
					url: 'https://api.github.com/licenses/gpl-3.0',
				},
				languages: [
					{ name: 'Vue', count: 4000 },
					{ name: 'TypeScript', count: 3000 },
				],
				latestRelease: 'v2.1.0',
			}

			const mockResponse = {
				data: {
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/complete-repo')

			expect(result).toEqual(mockRepoData)
			expect(result?.license).toBeDefined()
			expect(result?.latestRelease).toBe('v2.1.0')
			expect(result?.languages.length).toBeGreaterThan(0)
		})

		it('should pass correct repository parameter format', async () => {
			const mockResponse = {
				data: { data: { languages: [] } },
			}

			mockPost.mockResolvedValue(mockResponse)

			await getRepoInfo('username/repository-name')

			expect(mockPost).toHaveBeenCalledWith('/github', {
				repo: 'username/repository-name',
			})
		})

		it('should handle axios error with no response', async () => {
			const axiosError = {
				message: 'Request failed',
				isAxiosError: true,
			}

			mockPost.mockRejectedValue(axiosError)

			const result = await getRepoInfo('owner/repo')

			expect(result).toBeUndefined()
		})

		it('should extract data from nested response structure', async () => {
			const mockRepoData: RepoInfo = {
				languages: [{ name: 'Rust', count: 2000 }],
				latestRelease: 'v3.0.0',
			}

			const mockResponse = {
				data: {
					success: true,
					data: mockRepoData,
				},
			}

			mockPost.mockResolvedValue(mockResponse)

			const result = await getRepoInfo('owner/nested-data')

			expect(result).toEqual(mockRepoData)
		})
	})
})
