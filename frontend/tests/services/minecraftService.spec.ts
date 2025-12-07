import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
	queryMinecraftStatus,
	queryMinecraftAvatar,
} from '../../src/services/minecraftService'
import type { MinecraftStatusResponse } from '../../src/types/minecraft'

vi.mock('axios')

describe('Minecraft Service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('queryMinecraftStatus', () => {
		it('should fetch server status successfully', async () => {
			const mockServerData: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'minecraft.example.com',
					ip: '192.168.1.1',
					online: true,
					port: 25565,
					players: {
						online: 5,
						max: 20,
						list: [
							{ name: 'Player1', uuid: 'uuid-1' },
							{ name: 'Player2', uuid: 'uuid-2' },
						],
					},
					version: '1.20.1',
					software: 'Paper',
					motd: {
						clean: ['Welcome to our server!'],
						html: ['<p>Welcome to our server!</p>'],
						raw: ['§aWelcome to our server!'],
					},
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockServerData)

			const result = await queryMinecraftStatus('minecraft.example.com')

			expect(result).toEqual(mockServerData)
			expect(axios.get).toHaveBeenCalledWith(
				'https://api.mcsrvstat.us/3/minecraft.example.com'
			)
		})

		it('should use correct API endpoint with server IP', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'play.hypixel.net',
					ip: '172.65.200.1',
					online: true,
					port: 25565,
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			await queryMinecraftStatus('play.hypixel.net')

			expect(axios.get).toHaveBeenCalledWith(
				'https://api.mcsrvstat.us/3/play.hypixel.net'
			)
		})

		it('should handle offline server', async () => {
			const mockOfflineServer: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'offline.server.com',
					ip: '10.0.0.1',
					online: false,
					port: 25565,
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockOfflineServer)

			const result = await queryMinecraftStatus('offline.server.com')

			expect(result.data.online).toBe(false)
		})

		it('should handle server with custom port', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'custom.server.com',
					ip: '192.168.1.100',
					online: true,
					port: 25566,
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftStatus('custom.server.com:25566')

			expect(result.data.port).toBe(25566)
		})

		it('should handle server with no players', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'empty.server.com',
					ip: '10.10.10.10',
					online: true,
					port: 25565,
					players: {
						online: 0,
						max: 10,
					},
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftStatus('empty.server.com')

			expect(result.data.players?.online).toBe(0)
			expect(result.data.players?.list).toBeUndefined()
		})

		it('should handle server with EULA blocked', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'blocked.server.com',
					ip: '127.0.0.1',
					online: false,
					port: 25565,
					eula_blocked: true,
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftStatus('blocked.server.com')

			expect(result.data.eula_blocked).toBe(true)
		})

		it('should handle API errors', async () => {
			const error = new Error('Network error')
			vi.mocked(axios.get).mockRejectedValue(error)

			await expect(queryMinecraftStatus('error.server.com')).rejects.toThrow(
				'Network error'
			)
		})

		it('should handle server with plugins', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'modded.server.com',
					ip: '192.168.50.1',
					online: true,
					port: 25565,
					plugins: [
						{ name: 'EssentialsX', version: '2.20.0' },
						{ name: 'WorldEdit', version: '7.2.0' },
					],
					software: 'Spigot',
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftStatus('modded.server.com')

			expect(result.data.plugins).toBeDefined()
			expect(result.data.plugins).toHaveLength(2)
		})

		it('should handle server with protocol information', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: 'protocol.server.com',
					ip: '172.16.0.1',
					online: true,
					port: 25565,
					protocol: {
						name: 'Minecraft 1.20.1',
						version: '763',
					},
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftStatus('protocol.server.com')

			expect(result.data.protocol).toBeDefined()
			expect(result.data.protocol?.version).toBe('763')
		})

		it('should handle IP address as server identifier', async () => {
			const mockResponse: MinecraftStatusResponse = {
				config: {},
				data: {
					debug: {},
					hostname: '192.168.1.50',
					ip: '192.168.1.50',
					online: true,
					port: 25565,
				},
				headers: {},
				request: {},
				status: 200,
				statusText: 'OK',
			}

			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			await queryMinecraftStatus('192.168.1.50')

			expect(axios.get).toHaveBeenCalledWith(
				'https://api.mcsrvstat.us/3/192.168.1.50'
			)
		})
	})

	describe('queryMinecraftAvatar', () => {
		it('should fetch player avatar successfully', async () => {
			const mockBlob = new Blob(['mock image data'], { type: 'image/png' })
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			const result = await queryMinecraftAvatar('Steve')

			expect(result.data).toEqual(mockBlob)
			expect(axios.get).toHaveBeenCalledWith(
				'https://minotar.net/avatar/Steve/25',
				{ responseType: 'blob' }
			)
		})

		it('should use correct avatar API endpoint', async () => {
			const mockBlob = new Blob()
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			await queryMinecraftAvatar('Notch')

			expect(axios.get).toHaveBeenCalledWith(
				'https://minotar.net/avatar/Notch/25',
				{ responseType: 'blob' }
			)
		})

		it('should request blob response type', async () => {
			const mockBlob = new Blob()
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			await queryMinecraftAvatar('Herobrine')

			const callArgs = vi.mocked(axios.get).mock.calls[0]
			expect(callArgs[1]).toEqual({ responseType: 'blob' })
		})

		it('should handle different player names', async () => {
			const mockBlob = new Blob()
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			await queryMinecraftAvatar('Player123')

			expect(axios.get).toHaveBeenCalledWith(
				'https://minotar.net/avatar/Player123/25',
				expect.any(Object)
			)
		})

		it('should handle avatar fetch errors', async () => {
			const error = new Error('Avatar not found')
			vi.mocked(axios.get).mockRejectedValue(error)

			await expect(queryMinecraftAvatar('InvalidPlayer')).rejects.toThrow(
				'Avatar not found'
			)
		})

		it('should handle network errors for avatars', async () => {
			const networkError = new Error('Network error')
			vi.mocked(axios.get).mockRejectedValue(networkError)

			await expect(queryMinecraftAvatar('TestUser')).rejects.toThrow(
				'Network error'
			)
		})

		it('should handle special characters in player names', async () => {
			const mockBlob = new Blob()
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			await queryMinecraftAvatar('Player_123')

			expect(axios.get).toHaveBeenCalledWith(
				'https://minotar.net/avatar/Player_123/25',
				{ responseType: 'blob' }
			)
		})

		it('should use fixed size of 25 pixels', async () => {
			const mockBlob = new Blob()
			vi.mocked(axios.get).mockResolvedValue({ data: mockBlob })

			await queryMinecraftAvatar('AnyPlayer')

			const url = vi.mocked(axios.get).mock.calls[0][0]
			expect(url).toContain('/25')
		})

		it('should return axios response with blob data', async () => {
			const mockBlob = new Blob(['test'], { type: 'image/png' })
			const mockResponse = {
				data: mockBlob,
				status: 200,
				statusText: 'OK',
			}
			vi.mocked(axios.get).mockResolvedValue(mockResponse)

			const result = await queryMinecraftAvatar('TestPlayer')

			expect(result.data).toBe(mockBlob)
			expect(result.status).toBe(200)
		})
	})
})
