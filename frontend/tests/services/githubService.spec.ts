import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	getLicence,
	getLanguages,
	getLatestRelease,
} from '../../src/services/githubService'

const { mockGet, mockCreate } = vi.hoisted(() => {
	const mockGet = vi.fn()
	return {
		mockGet,
		mockCreate: vi.fn(() => ({
			get: mockGet,
		})),
	}
})

vi.mock('axios', () => ({
	default: {
		create: mockCreate,
	},
}))

vi.mock('@/helpers/alertMixin', () => ({
	default: () => ({
		showErrorMessage: vi.fn(),
	}),
}))

describe('githubService', () => {
	beforeEach(() => {
		mockGet.mockClear()
	})

	describe('getLicence', () => {
		it('should fetch license information successfully', async () => {
			const mockLicense = {
				key: 'mit',
				name: 'MIT License',
				spdx_id: 'MIT',
				url: 'https://api.github.com/licenses/mit',
			}

			mockGet.mockResolvedValue({
				data: { license: mockLicense },
			})

			const result = await getLicence('test-repo')

			expect(result).toEqual(mockLicense)
			expect(mockGet).toHaveBeenCalledWith('/test-repo/license')
		})

		it('should handle errors and return undefined', async () => {
			mockGet.mockRejectedValue(new Error('Not found'))

			const result = await getLicence('test-repo')

			expect(result).toBeUndefined()
		})

		it('should call correct GitHub API endpoint', async () => {
			mockGet.mockResolvedValue({
				data: { license: { key: 'mit' } },
			})

			await getLicence('my-repo')

			expect(mockGet).toHaveBeenCalledWith('/my-repo/license')
		})
	})

	describe('getLanguages', () => {
		it('should fetch and transform languages data', async () => {
			const mockLanguagesData = {
				TypeScript: 5000,
				JavaScript: 3000,
				CSS: 1000,
			}

			mockGet.mockResolvedValue({
				data: mockLanguagesData,
			})

			const result = await getLanguages('test-repo')

			expect(result).toHaveLength(3)
			expect(result).toContainEqual({ name: 'TypeScript', count: 5000 })
			expect(result).toContainEqual({ name: 'JavaScript', count: 3000 })
			expect(result).toContainEqual({ name: 'CSS', count: 1000 })
		})

		it('should handle errors and return empty array', async () => {
			mockGet.mockRejectedValue(new Error('API error'))

			const result = await getLanguages('test-repo')

			expect(result).toEqual([])
		})

		it('should call correct GitHub API endpoint', async () => {
			mockGet.mockResolvedValue({
				data: { Python: 1000 },
			})

			await getLanguages('my-repo')

			expect(mockGet).toHaveBeenCalledWith('/my-repo/languages')
		})

		it('should handle empty languages response', async () => {
			mockGet.mockResolvedValue({
				data: {},
			})

			const result = await getLanguages('test-repo')

			expect(result).toEqual([])
		})

		it('should transform language data correctly', async () => {
			mockGet.mockResolvedValue({
				data: { Rust: 12345 },
			})

			const result = await getLanguages('test-repo')

			expect(result).toEqual([{ name: 'Rust', count: 12345 }])
		})
	})

	describe('getLatestRelease', () => {
		it('should fetch latest release tag name', async () => {
			mockGet.mockResolvedValue({
				data: { tag_name: 'v1.2.3' },
			})

			const result = await getLatestRelease('test-repo')

			expect(result).toBe('v1.2.3')
		})

		it('should handle errors and return undefined', async () => {
			mockGet.mockRejectedValue(new Error('No releases'))

			const result = await getLatestRelease('test-repo')

			expect(result).toBeUndefined()
		})

		it('should call correct GitHub API endpoint', async () => {
			mockGet.mockResolvedValue({
				data: { tag_name: 'v2.0.0' },
			})

			await getLatestRelease('my-repo')

			expect(mockGet).toHaveBeenCalledWith('/my-repo/releases/latest')
		})

		it('should handle different tag name formats', async () => {
			const testCases = ['v1.0.0', '2.0.0', 'release-3.0', 'beta-1']

			for (const tagName of testCases) {
				mockGet.mockResolvedValue({
					data: { tag_name: tagName },
				})

				const result = await getLatestRelease('test-repo')
				expect(result).toBe(tagName)
			}
		})
	})

	describe('GitHub API configuration', () => {
		it('should create axios instance with base URL', () => {
			expect(mockCreate).toHaveBeenCalled()
			expect(mockCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: expect.any(String),
				})
			)
		})

		it('should include required GitHub API headers', () => {
			expect(mockCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Accept: expect.any(String),
						'X-GitHub-Api-Version': expect.any(String),
					}),
				})
			)
		})
	})
})
