/// <reference types="node" />
import nodemailer from 'nodemailer'
import type { Transporter, SentMessageInfo } from 'nodemailer'
import type SMTPPool from 'nodemailer/lib/smtp-pool/index.js'
import { config } from '../config/env.js'

const CONNECTION_TIMEOUT_MS = 10000
const GREETING_TIMEOUT_MS = 10000
const SOCKET_TIMEOUT_MS = 20000
const VERIFY_TIMEOUT_MS = 15000

const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs: number,
	message: string
): Promise<T> => {
	let timeoutId: NodeJS.Timeout | undefined
	const timeoutPromise = new Promise<never>((_resolve, reject) => {
		timeoutId = setTimeout(() => {
			reject(new Error(message))
		}, timeoutMs)
	})

	try {
		return await Promise.race([promise, timeoutPromise])
	} finally {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
	}
}

export const createTransporter = (): Transporter => {
	const options: SMTPPool.Options = {
		pool: true,
		maxConnections: 1,
		maxMessages: Infinity,
		host: config.email.host,
		port: config.email.port,
		requireTLS: config.email.requireTLS,
		connectionTimeout: CONNECTION_TIMEOUT_MS,
		greetingTimeout: GREETING_TIMEOUT_MS,
		socketTimeout: SOCKET_TIMEOUT_MS,
		auth: {
			user: config.email.user,
			pass: config.email.password,
		},
		tls: {
			servername: config.email.host,
			rejectUnauthorized: config.email.tlsRejectUnauthorized,
		},
	}
	return nodemailer.createTransport(options)
}

let sharedTransporter: Transporter | undefined

export const getTransporter = (): Transporter => {
	sharedTransporter ??= createTransporter()
	return sharedTransporter
}

export const closeTransporter = (): void => {
	if (sharedTransporter) {
		sharedTransporter.close()
		sharedTransporter = undefined
	}
}

const RETRY_DELAY_MS = 1500
const MAX_RETRIES = 2

export const verifyEmailConnection = async (
	transporter: Transporter,
	timeoutMs = VERIFY_TIMEOUT_MS,
	maxRetries = MAX_RETRIES
): Promise<number> => {
	const start = Date.now()
	let lastError: unknown

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			await withTimeout(
				transporter.verify(),
				timeoutMs,
				'SMTP connection timeout'
			)
			return Date.now() - start
		} catch (error) {
			lastError = error
			if (attempt < maxRetries) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
			}
		}
	}

	throw lastError
}

const HEALTH_CACHE_TTL_MS = 30000

export interface EmailHealthStatus {
	status: 'connected' | 'disconnected'
	responseTime?: string
	error?: string
	checkedAt: number
}

let cachedHealth: EmailHealthStatus | undefined
let pendingCheck: Promise<EmailHealthStatus> | undefined

const runEmailHealthCheck = async (): Promise<EmailHealthStatus> => {
	try {
		const duration = await verifyEmailConnection(
			getTransporter(),
			VERIFY_TIMEOUT_MS,
			0
		)
		cachedHealth = {
			status: 'connected',
			responseTime: `${duration}ms`,
			checkedAt: Date.now(),
		}
	} catch (error) {
		cachedHealth = {
			status: 'disconnected',
			error: error instanceof Error ? error.message : 'Unknown error',
			checkedAt: Date.now(),
		}
	}
	return cachedHealth
}

export const getEmailHealth = async (): Promise<EmailHealthStatus> => {
	if (
		cachedHealth &&
		Date.now() - cachedHealth.checkedAt < HEALTH_CACHE_TTL_MS
	) {
		return cachedHealth
	}
	pendingCheck ??= runEmailHealthCheck().finally(() => {
		pendingCheck = undefined
	})
	return pendingCheck
}

export const resetEmailHealthCache = (): void => {
	cachedHealth = undefined
	pendingCheck = undefined
	closeTransporter()
}

interface SendEmailParams {
	from: string
	message: string
	project: string
}

export const sendEmail = async ({
	from,
	message,
	project,
}: SendEmailParams): Promise<SentMessageInfo> => {
	let lastError: unknown
	const transporter = getTransporter()
	const mailOptions = {
		from: config.email.user,
		to: config.email.to,
		subject: project,
		text: message,
		replyTo: from,
	}

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await transporter.sendMail(mailOptions)
		} catch (error) {
			lastError = error
			if (attempt < MAX_RETRIES) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
			}
		}
	}

	throw lastError
}
