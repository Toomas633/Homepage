/// <reference types="node" />
import nodemailer from 'nodemailer'
import type { Transporter, SentMessageInfo } from 'nodemailer'
import { config } from '../config/env.js'

// Timeouts are deliberately generous. A reachable mail server can still be slow
// to complete the SMTP handshake — for example while it performs a reverse-DNS
// (FCrDNS) lookup on the connecting client, or during the brief window after a
// certbot certificate renewal reloads it. Previously these were 5s, which made
// the app report "SMTP connection timeout" even though the server was reachable
// and simply slow to send its greeting.
const CONNECTION_TIMEOUT_MS = 10000
const GREETING_TIMEOUT_MS = 10000
const SOCKET_TIMEOUT_MS = 20000

// Outer safety cap for verify(). Kept LARGER than the connection/greeting
// timeouts above so nodemailer's own (socket-cleaning) timeout fires first and
// surfaces the real error. This wrapper only guards edge cases nodemailer does
// not time out itself, such as a hanging DNS lookup.
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
	return nodemailer.createTransport({
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
			session: false,
		},
	})
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

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		let transporter: Transporter | undefined
		try {
			transporter = createTransporter()
			const mailOptions = {
				from: config.email.user,
				to: config.email.to,
				subject: project,
				text: message,
				replyTo: from,
			}
			return await transporter.sendMail(mailOptions)
		} catch (error) {
			lastError = error
			if (attempt < MAX_RETRIES) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
			}
		} finally {
			transporter?.close()
		}
	}

	throw lastError
}
