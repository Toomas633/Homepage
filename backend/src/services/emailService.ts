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
	})
}

export const verifyEmailConnection = async (
	transporter: Transporter,
	timeoutMs = DEFAULT_SMTP_TIMEOUT_MS
): Promise<number> => {
	const start = Date.now()
	await withTimeout(transporter.verify(), timeoutMs, 'SMTP connection timeout')
	return Date.now() - start
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
