import axios from 'axios'
import { createHash, randomBytes } from 'node:crypto'
import { config } from '../config/env.js'
import type {
	AnalyticsDestination,
	AnalyticsEvent,
	AnalyticsEventInput,
	AnalyticsParamValue,
} from '../types/index.js'

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_STRING = 200
const MAX_PARAMS = 20

// Random per-process secret: visitor ids cannot be reversed or linked across
// restarts. The date component rotates identifiers daily (no long-term tracking).
const processSecret = randomBytes(32).toString('hex')

export const clip = (value: unknown, max = MAX_STRING): string =>
	typeof value === 'string' ? value.slice(0, max) : ''

export const hashVisitor = (ip: string, userAgent: string, now = Date.now()) =>
	createHash('sha256')
		.update(
			`${processSecret}|${new Date(now).toISOString().slice(0, 10)}|${ip}|${userAgent}`
		)
		.digest('hex')
		.slice(0, 32)

export const detectDevice = (userAgent: string): string => {
	if (/bot|crawl|spider|slurp/i.test(userAgent)) return 'bot'
	if (/ipad|tablet/i.test(userAgent)) return 'tablet'
	if (/mobi|android|iphone/i.test(userAgent)) return 'mobile'
	return 'desktop'
}

const sanitizePath = (value: unknown): string => {
	const raw = clip(value, 500)
	// drop query string and hash: they may contain personal data
	return raw.split(/[?#]/)[0] || '/'
}

const sanitizeReferrer = (value: unknown): string => {
	try {
		return new URL(clip(value, 500)).origin
	} catch {
		return ''
	}
}

const sanitizeParams = (
	params: unknown
): Record<string, AnalyticsParamValue> => {
	const result: Record<string, AnalyticsParamValue> = {}
	if (typeof params !== 'object' || params === null || Array.isArray(params)) {
		return result
	}
	for (const [key, value] of Object.entries(params).slice(0, MAX_PARAMS)) {
		if (typeof value === 'string') result[clip(key, 40)] = clip(value)
		else if (typeof value === 'number' && Number.isFinite(value))
			result[clip(key, 40)] = value
		else if (typeof value === 'boolean') result[clip(key, 40)] = value
	}
	return result
}

export const isValidEventName = (name: unknown): name is string =>
	typeof name === 'string' && /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(name)

/** Google Analytics 4 via the server-side Measurement Protocol. */
export const createGa4Destination = (
	measurementId: string,
	apiSecret: string
): AnalyticsDestination => ({
	name: 'ga4',
	send: async (event) => {
		const isPageview = event.name === 'page_view'
		await axios.post(
			'https://www.google-analytics.com/mp/collect',
			{
				client_id: event.visitorId,
				events: [
					{
						name: event.name,
						params: {
							...event.params,
							engagement_time_msec: 1,
							...(isPageview && {
								page_location: event.path,
								page_title: event.title,
								page_referrer: event.referrer,
							}),
						},
					},
				],
			},
			{
				params: { measurement_id: measurementId, api_secret: apiSecret },
				timeout: 5000,
			}
		)
	},
})

const absoluteUrl = (siteUrl: string, path: string) =>
	`${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

/**
 * Plausible Events API. No IP is forwarded; a per-visitor pseudo user-agent
 * lets Plausible tell visitors apart without receiving personal data.
 */
export const createPlausibleDestination = (
	baseUrl: string,
	domain: string,
	siteUrl: string
): AnalyticsDestination => ({
	name: 'plausible',
	send: async (event) => {
		await axios.post(
			`${baseUrl}/api/event`,
			{
				name: event.name === 'page_view' ? 'pageview' : event.name,
				url: absoluteUrl(siteUrl, event.path),
				domain,
				referrer: event.referrer || undefined,
				props: event.params,
			},
			{
				headers: {
					'User-Agent': `visitor/${event.visitorId}`,
					'X-Forwarded-For': '127.0.0.1',
				},
				timeout: 5000,
			}
		)
	},
})

/** Matomo HTTP Tracking API. */
export const createMatomoDestination = (
	baseUrl: string,
	siteId: string,
	siteUrl: string
): AnalyticsDestination => ({
	name: 'matomo',
	send: async (event) => {
		const isPageview = event.name === 'page_view'
		await axios.get(`${baseUrl}/matomo.php`, {
			params: {
				idsite: siteId,
				rec: 1,
				apiv: 1,
				send_image: 0,
				_id: event.visitorId.slice(0, 16),
				url: absoluteUrl(siteUrl, event.path),
				action_name: isPageview ? event.title || event.path : undefined,
				urlref: event.referrer || undefined,
				e_c: isPageview ? undefined : 'event',
				e_a: isPageview ? undefined : event.name,
				e_n: isPageview ? undefined : JSON.stringify(event.params),
			},
			timeout: 5000,
		})
	},
})

/** Generic JSON webhook for any other platform (Segment-like, n8n, custom). */
export const createWebhookDestination = (
	url: string,
	secret: string
): AnalyticsDestination => ({
	name: 'webhook',
	send: async (event) => {
		await axios.post(url, event, {
			headers: secret ? { Authorization: ['Bearer', secret].join(' ') } : {},
			timeout: 5000,
		})
	},
})

class AnalyticsService {
	private events: AnalyticsEvent[] = []
	private destinations: AnalyticsDestination[] = []

	constructor() {
		const c = config.analytics
		if (c.ga4MeasurementId && c.ga4ApiSecret) {
			this.destinations.push(
				createGa4Destination(c.ga4MeasurementId, c.ga4ApiSecret)
			)
		}
		if (c.plausibleDomain) {
			this.destinations.push(
				createPlausibleDestination(c.plausibleUrl, c.plausibleDomain, c.siteUrl)
			)
		}
		if (c.matomoUrl && c.matomoSiteId) {
			this.destinations.push(
				createMatomoDestination(c.matomoUrl, c.matomoSiteId, c.siteUrl)
			)
		}
		if (c.webhookUrl) {
			this.destinations.push(
				createWebhookDestination(c.webhookUrl, c.webhookSecret)
			)
		}
	}

	/** Register any additional forwarding target (Plausible, Matomo, ...). */
	addDestination(destination: AnalyticsDestination): void {
		this.destinations.push(destination)
	}

	reset(): void {
		this.events = []
	}

	record(
		input: AnalyticsEventInput,
		ip: string,
		userAgent: string,
		now = Date.now()
	): AnalyticsEvent {
		const event: AnalyticsEvent = {
			name: input.name,
			timestamp: now,
			visitorId: hashVisitor(ip, userAgent, now),
			path: sanitizePath(input.path),
			title: clip(input.title),
			referrer: sanitizeReferrer(input.referrer),
			device: detectDevice(userAgent),
			params: sanitizeParams(input.params),
		}
		this.prune(now)
		this.events.push(event)
		if (this.events.length > config.analytics.maxEvents) {
			this.events.splice(0, this.events.length - config.analytics.maxEvents)
		}
		for (const destination of this.destinations) {
			destination.send(event).catch((error) => {
				console.warn(
					`Analytics destination ${destination.name} failed:`,
					error instanceof Error ? error.message : 'Unknown error'
				)
			})
		}
		return event
	}

	private prune(now: number): void {
		const cutoff = now - config.analytics.retentionDays * DAY_MS
		const index = this.events.findIndex((e) => e.timestamp >= cutoff)
		if (index === -1) this.events = []
		else if (index > 0) this.events.splice(0, index)
	}

	private static count(values: string[], limit = 20) {
		const counts = new Map<string, number>()
		for (const v of values) counts.set(v, (counts.get(v) || 0) + 1)
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([name, count]) => ({ name, count }))
	}

	getStats(from?: number, to = Date.now()) {
		this.prune(Date.now())
		const start = from ?? to - 7 * DAY_MS
		const events = this.events.filter(
			(e) => e.timestamp >= start && e.timestamp <= to
		)
		const pageviews = events.filter((e) => e.name === 'page_view')
		const daily = new Map<string, { events: number; visitors: Set<string> }>()
		for (const e of events) {
			const day = new Date(e.timestamp).toISOString().slice(0, 10)
			const entry = daily.get(day) || { events: 0, visitors: new Set() }
			entry.events++
			entry.visitors.add(e.visitorId)
			daily.set(day, entry)
		}
		return {
			from: new Date(start).toISOString(),
			to: new Date(to).toISOString(),
			totals: {
				events: events.length,
				pageviews: pageviews.length,
				uniqueVisitors: new Set(events.map((e) => e.visitorId)).size,
			},
			events: AnalyticsService.count(events.map((e) => e.name)),
			topPages: AnalyticsService.count(pageviews.map((e) => e.path)),
			referrers: AnalyticsService.count(
				pageviews.filter((e) => e.referrer).map((e) => e.referrer)
			),
			devices: AnalyticsService.count(events.map((e) => e.device)),
			daily: [...daily.entries()]
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([date, d]) => ({
					date,
					events: d.events,
					uniqueVisitors: d.visitors.size,
				})),
		}
	}

	toPrometheus(stats: ReturnType<AnalyticsService['getStats']>): string {
		const esc = (v: string) => v.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
		const lines = [
			'# TYPE homepage_events_total gauge',
			`homepage_events_total ${stats.totals.events}`,
			'# TYPE homepage_pageviews_total gauge',
			`homepage_pageviews_total ${stats.totals.pageviews}`,
			'# TYPE homepage_unique_visitors gauge',
			`homepage_unique_visitors ${stats.totals.uniqueVisitors}`,
			'# TYPE homepage_event_count gauge',
			...stats.events.map(
				(e) => `homepage_event_count{name="${esc(e.name)}"} ${e.count}`
			),
			'# TYPE homepage_page_views gauge',
			...stats.topPages.map(
				(p) => `homepage_page_views{path="${esc(p.name)}"} ${p.count}`
			),
		]
		return `${lines.join('\n')}\n`
	}
}

export const analyticsService = new AnalyticsService()
