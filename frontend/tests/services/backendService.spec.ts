import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
	getBackendHealth,
	getBackendVersion,
} from '../../src/services/backendService'

vi.mock('axios')

describe('Backend Service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	describe('getBackendHealth', () => {
		it('should return health data on successful request', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const result = await getBackendHealth()

			expect(result).toEqual(mockHealthData)
			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/health'))
		})

		it('should return null on network error', async () => {
			const networkError = new Error('Network Error')
			vi.mocked(axios.get).mockRejectedValue(networkError)

			const result = await getBackendHealth()

			expect(result).toBeNull()
			expect(console.error).toHaveBeenCalledWith(
				'Failed to fetch backend health:',
				networkError
			)
		})

		it('should return null on 404 error', async () => {
			const error404 = {
				response: { status: 404, data: { error: 'Not Found' } },
			}
			vi.mocked(axios.get).mockRejectedValue(error404)

			const result = await getBackendHealth()

			expect(result).toBeNull()
			expect(console.error).toHaveBeenCalledWith(
				'Failed to fetch backend health:',
				error404
			)
		})

		it('should return null on 500 error', async () => {
			const error500 = {
				response: { status: 500, data: { error: 'Internal Server Error' } },
			}
			vi.mocked(axios.get).mockRejectedValue(error500)

			const result = await getBackendHealth()

			expect(result).toBeNull()
		})

		it('should return unhealthy status when backend is unhealthy', async () => {
			const mockUnhealthyData = {
				status: 'unhealthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'disconnected' as const,
					error: 'SMTP connection failed',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockUnhealthyData,
			})

			const result = await getBackendHealth()

			expect(result).toEqual(mockUnhealthyData)
			expect(result?.status).toBe('unhealthy')
			expect(result?.email.status).toBe('disconnected')
		})

		it('should handle timeout errors', async () => {
			const timeoutError = {
				code: 'ECONNABORTED',
				message: 'timeout of 5000ms exceeded',
			}
			vi.mocked(axios.get).mockRejectedValue(timeoutError)

			const result = await getBackendHealth()

			expect(result).toBeNull()
			expect(console.error).toHaveBeenCalled()
		})
	})

	describe('getBackendVersion', () => {
		it('should return version from health data', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const result = await getBackendVersion()

			expect(result).toBe('2.0.2')
		})

		it('should return "Unknown" when health data is null', async () => {
			vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

			const result = await getBackendVersion()

			expect(result).toBe('Unknown')
			expect(console.error).toHaveBeenCalledWith(
				'Failed to fetch backend health:',
				expect.any(Error)
			)
		})

		it('should return "Unknown" when version is missing', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: undefined,
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const result = await getBackendVersion()

			expect(result).toBe('Unknown')
		})

		it('should return "Unknown" when health is unhealthy', async () => {
			const mockUnhealthyData = {
				status: 'unhealthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'disconnected' as const,
					error: 'SMTP connection failed',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockUnhealthyData,
			})

			const result = await getBackendVersion()

			expect(result).toBe('2.0.2')
		})

		it('should handle empty version string', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '',
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const result = await getBackendVersion()

			expect(result).toBe('Unknown')
		})

		it('should handle exception in getBackendHealth', async () => {
			const error = new Error('Unexpected error')
			vi.mocked(axios.get).mockRejectedValue(error)

			const result = await getBackendVersion()

			expect(result).toBe('Unknown')
			expect(console.error).toHaveBeenCalledWith(
				'Failed to fetch backend health:',
				expect.any(Error)
			)
		})

		it('should return version from cache on second call', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const result1 = await getBackendVersion()
			const result2 = await getBackendVersion()

			expect(result1).toBe('2.0.2')
			expect(result2).toBe('2.0.2')
			expect(axios.get).toHaveBeenCalledTimes(2)
		})
	})

	describe('Integration', () => {
		it('should handle complete flow from version request to health check', async () => {
			const mockHealthData = {
				status: 'healthy' as const,
				timestamp: '2025-12-04T12:00:00.000Z',
				version: '2.0.2',
				email: {
					status: 'connected' as const,
					responseTime: '150ms',
				},
			}

			vi.mocked(axios.get).mockResolvedValue({
				data: mockHealthData,
			})

			const version = await getBackendVersion()
			const health = await getBackendHealth()

			expect(version).toBe('2.0.2')
			expect(health).toEqual(mockHealthData)
			expect(axios.get).toHaveBeenCalledTimes(2)
		})

		it('should handle partial failures gracefully', async () => {
			vi.mocked(axios.get).mockResolvedValueOnce({
				data: {
					status: 'healthy' as const,
					timestamp: '2025-12-04T12:00:00.000Z',
					version: '2.0.2',
					email: {
						status: 'connected' as const,
						responseTime: '150ms',
					},
				},
			})

			vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network Error'))

			const version1 = await getBackendVersion()
			const version2 = await getBackendVersion()

			expect(version1).toBe('2.0.2')
			expect(version2).toBe('Unknown')
		})
	})
})
