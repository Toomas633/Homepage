import { Request } from 'express'

export interface EmailConfig {
	host: string
	user: string
	password: string
	to: string
	port: number
	requireTLS: boolean
	tlsRejectUnauthorized: boolean
}

export interface ServerConfig {
	port: number
}

export interface AllowedOriginsConfig {
	origins: string[]
}

export interface AppConfig {
	email: EmailConfig
	server: ServerConfig
	allowedOrigins: AllowedOriginsConfig
	github: GithubConfig
}

export interface ContactFormData {
	name: string
	email: string
	subject: string
	message: string
}

export interface ApiResponse<T = unknown> {
	success: boolean
	message?: string
	data?: T
	error?: string
}

export interface ErrorResponse {
	error: string
	message: string
}

export interface GitHubResponse {
	license?: License
	languages: Language[]
	latestRelease?: string
}

export interface License {
	key: string
	name: string
	node_id: string
	spdx_id: string
	url: string
}

export interface Language {
	name: string
	count: number
}

export interface GithubConfig {
	token?: string
}

export interface GitHubRequest extends Request {
	body: {
		repo?: string
	}
}

export interface EmailRequest extends Request {
	body: {
		from: string
		message: string
		project: string
	}
}

export interface HealthResponse {
	status: 'healthy' | 'degraded' | 'unhealthy'
	timestamp: string
	version: string
	email: {
		status: 'connected' | 'disconnected'
		responseTime?: string
		error?: string
	}
}
