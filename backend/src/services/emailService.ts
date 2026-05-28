/// <reference types="node" />
import nodemailer from 'nodemailer'
import type { Transporter, SentMessageInfo } from 'nodemailer'
import { config } from '../config/env.js'

const DEFAULT_SMTP_TIMEOUT_MS = 5000

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
	return nodemailer.createTransport({
		host: config.email.host,
		port: config.email.port,
		requireTLS: config.email.requireTLS,
		connectionTimeout: DEFAULT_SMTP_TIMEOUT_MS,
		greetingTimeout: DEFAULT_SMTP_TIMEOUT_MS,
		socketTimeout: DEFAULT_SMTP_TIMEOUT_MS * 2,
		auth: {
			user: config.email.user,
			pass: config.email.password,
		},
		tls: {
			servername: config.email.host,
			rejectUnauthorized: config.email.tlsRejectUnauthorized,
		},
	})
}

const RETRY_DELAY_MS = 1500
const MAX_RETRIES = 2

export const verifyEmailConnection = async (
	transporter: Transporter,
	timeoutMs = DEFAULT_SMTP_TIMEOUT_MS,
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
	const transporter = createTransporter()
	await verifyEmailConnection(transporter)

	const mailOptions = {
		from: config.email.user,
		to: config.email.to,
		subject: project,
		text: message,
		replyTo: from,
	}

	return await transporter.sendMail(mailOptions)
}
