import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosInstance } from 'axios'
import type {
	License,
	Language,
	GitHubResponse,
} from '../../src/types/index.js'

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

const mockGet = vi.hoisted(() => vi.fn())
const mockCreate = vi.hoisted(() => vi.fn())

vi.mock('axios', () => ({
	default: {
		create: mockCreate,
	},
}))

mockCreate.mockReturnValue({
	get: mockGet,
} as unknown as AxiosInstance)

const { githubService } = await import('../../src/services/githubService.js')

describe('GithubService', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		consoleErrorSpy.mockClear()
	})

	describe('getLicense', () => {
		it('should fetch and return license data successfully', async () => {
			const mockLicense: License = {
				key: 'mit',
				name: 'MIT License',
				node_id: 'MDc6TGljZW5zZTEz',
				spdx_id: 'MIT',
				url: 'https://api.github.com/licenses/mit',
			}

			mockGet.mockResolvedValue({
				data: { license: mockLicense },
			})

			const result = await githubService.getLicense('owner/repo')

			expect(mockGet).toHaveBeenCalledWith('/owner/repo/license')
			expect(result).toEqual(mockLicense)
		})

		it('should return undefined on error', async () => {
			mockGet.mockRejectedValue(new Error('API Error'))

			const result = await githubService.getLicense('owner/repo')

			expect(result).toBeUndefined()
			expect(console.error).toHaveBeenCalled()
		})

		it('should handle 404 errors gracefully', async () => {
			const error = new Error('Not Found')
			Object.assign(error, { response: { status: 404 } })
			mockGet.mockRejectedValue(error)

			const result = await githubService.getLicense('owner/repo')

			expect(result).toBeUndefined()
		})
	})

	describe('getLanguages', () => {
		it('should fetch and transform languages data successfully', async () => {
			const mockLanguagesData = {
				TypeScript: 50000,
				JavaScript: 30000,
				CSS: 10000,
			}

			const expectedLanguages: Language[] = [
				{ name: 'TypeScript', count: 50000 },
				{ name: 'JavaScript', count: 30000 },
				{ name: 'CSS', count: 10000 },
			]

			mockGet.mockResolvedValue({
				data: mockLanguagesData,
			})

			const result = await githubService.getLanguages('owner/repo')

			expect(mockGet).toHaveBeenCalledWith('/owner/repo/languages')
			expect(result).toHaveLength(3)
			expect(result).toEqual(expect.arrayContaining(expectedLanguages))
		})

		it('should return empty array on error', async () => {
			mockGet.mockRejectedValue(new Error('API Error'))

			const result = await githubService.getLanguages('owner/repo')

			expect(result).toEqual([])
			expect(console.error).toHaveBeenCalled()
		})

		it('should handle empty languages object', async () => {
			mockGet.mockResolvedValue({
				data: {},
			})

			const result = await githubService.getLanguages('owner/repo')

			expect(result).toEqual([])
		})

		it('should handle single language', async () => {
			mockGet.mockResolvedValue({
				data: { Python: 100000 },
			})

			const result = await githubService.getLanguages('owner/repo')

			expect(result).toHaveLength(1)
			expect(result[0]).toEqual({ name: 'Python', count: 100000 })
		})
	})

	describe('getLatestRelease', () => {
		it('should fetch and return latest release tag', async () => {
			mockGet.mockResolvedValue({
				data: { tag_name: 'v1.2.3' },
			})

			const result = await githubService.getLatestRelease('owner/repo')

			expect(mockGet).toHaveBeenCalledWith('/owner/repo/releases/latest')
			expect(result).toBe('v1.2.3')
		})

		it('should return undefined on error', async () => {
			mockGet.mockRejectedValue(new Error('API Error'))

			const result = await githubService.getLatestRelease('owner/repo')

			expect(result).toBeUndefined()
			expect(console.error).toHaveBeenCalled()
		})

		it('should handle repository with no releases', async () => {
			const error = new Error('Not Found')
			Object.assign(error, { response: { status: 404 } })
			mockGet.mockRejectedValue(error)

			const result = await githubService.getLatestRelease('owner/repo')

			expect(result).toBeUndefined()
		})

		it('should handle different tag formats', async () => {
			const testCases = ['v1.0.0', '1.0.0', 'release-1.0.0', 'beta-1']

			for (const tag of testCases) {
				mockGet.mockResolvedValue({
					data: { tag_name: tag },
				})

				const result = await githubService.getLatestRelease('owner/repo')
				expect(result).toBe(tag)
			}
		})
	})

	describe('queryData', () => {
		it('should fetch all data successfully', async () => {
			const mockLicense: License = {
				key: 'gpl-3.0',
				name: 'GNU General Public License v3.0',
				node_id: 'MDc6TGljZW5zZTk=',
				spdx_id: 'GPL-3.0',
				url: 'https://api.github.com/licenses/gpl-3.0',
			}

			const mockLanguagesData = {
				TypeScript: 75000,
				Vue: 25000,
			}

			mockGet
				.mockResolvedValueOnce({ data: { license: mockLicense } })
				.mockResolvedValueOnce({ data: mockLanguagesData })
				.mockResolvedValueOnce({ data: { tag_name: 'v2.0.0' } })

			const result: GitHubResponse = await githubService.queryData('owner/repo')

			expect(result.license).toEqual(mockLicense)
			expect(result.languages).toHaveLength(2)
			expect(result.latestRelease).toBe('v2.0.0')
		})

		it('should handle partial failures gracefully', async () => {
			const mockLanguagesData = {
				TypeScript: 50000,
			}

			mockGet
				.mockRejectedValueOnce(new Error('License not found'))
				.mockResolvedValueOnce({ data: mockLanguagesData })
				.mockRejectedValueOnce(new Error('No releases'))

			const result = await githubService.queryData('owner/repo')

			expect(result.license).toBeUndefined()
			expect(result.languages).toHaveLength(1)
			expect(result.latestRelease).toBeUndefined()
		})

		it('should handle complete failure', async () => {
			mockGet.mockRejectedValue(new Error('Network error'))

			const result = await githubService.queryData('owner/repo')

			expect(result.license).toBeUndefined()
			expect(result.languages).toEqual([])
			expect(result.latestRelease).toBeUndefined()
		})
	})

	describe('Error Handling', () => {
		it('should log errors with repository context', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error')
			mockGet.mockRejectedValue(new Error('Test error'))

			await githubService.getLicense('test/repo')

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('test/repo'),
				expect.any(Error)
			)
		})

		it('should handle network timeouts', async () => {
			const timeoutError = new Error('timeout of 5000ms exceeded')
			Object.assign(timeoutError, { code: 'ECONNABORTED' })
			mockGet.mockRejectedValue(timeoutError)

			const result = await githubService.getLanguages('owner/repo')

			expect(result).toEqual([])
		})

		it('should handle rate limiting errors', async () => {
			const rateLimitError = new Error('API rate limit exceeded')
			Object.assign(rateLimitError, { response: { status: 403 } })
			mockGet.mockRejectedValue(rateLimitError)

			const result = await githubService.getLatestRelease('owner/repo')

			expect(result).toBeUndefined()
		})
	})
})
