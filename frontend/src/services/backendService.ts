import { API_URL } from '@/constants/env'
import axios from 'axios'

interface BackendHealthResponse {
	status: 'healthy' | 'degraded' | 'unhealthy'
	timestamp: string
	version: string
	email: {
		status: 'connected' | 'disconnected'
		responseTime?: string
		error?: string
	}
}

export async function getBackendHealth(): Promise<BackendHealthResponse | null> {
	try {
		const response = await axios.get<BackendHealthResponse>(`${API_URL}/health`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data as BackendHealthResponse
		}
		console.error('Failed to fetch backend health:', error)
		return null
	}
}

export async function getBackendVersion(): Promise<string> {
	try {
		const health = await getBackendHealth()
		return health?.version || 'Unknown'
	} catch (error) {
		console.error('Failed to fetch backend version:', error)
		return 'Unknown'
	}
}
