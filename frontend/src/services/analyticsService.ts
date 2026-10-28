import { API_URL } from '@/constants/env'
import type { Consent } from '@/types/cookies'
import axios from 'axios'

export type AnalyticsParams = Record<string, string | number | boolean>

let analyticsConsent = false
let adsLoaded = false

export async function loadAds(): Promise<void> {
	if (adsLoaded || typeof document === 'undefined') return
	try {
		const { data } = await axios.get(`${API_URL}/pulse/config`)
		const client: string | null = data?.data?.adsenseClientId
		if (!client) return
		adsLoaded = true
		const script = document.createElement('script')
		script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`
		script.async = true
		script.crossOrigin = 'anonymous'
		document.head.appendChild(script)
	} catch (error) {
		console.error('Failed to load ads configuration:', error)
	}
}

export function updateConsent(consent: Consent): void {
	const newlyGranted = consent.analytics && !analyticsConsent
	analyticsConsent = consent.analytics
	if (newlyGranted) trackPageView()
	if (consent.ads) loadAds()
}

/** Sends a custom event to the backend analytics engine (consent required). */
export function trackEvent(name: string, params?: AnalyticsParams): void {
	if (!analyticsConsent) return
	axios
		.post(`${API_URL}/pulse/event`, {
			name,
			path: globalThis.location?.pathname,
			title: globalThis.document?.title,
			referrer: globalThis.document?.referrer,
			params,
			consent: { analytics: true },
		})
		.catch(() => undefined)
}

export function trackPageView(path?: string): void {
	trackEvent('page_view', path ? { route: path } : undefined)
}

export function trackOutboundClick(href: string, source = 'link'): void {
	try {
		const url = new URL(href, globalThis.location?.origin)
		if (url.origin === globalThis.location?.origin) return
		trackEvent('outbound_click', {
			host: url.hostname,
			url: url.origin + url.pathname,
			source,
		})
	} catch {
		// ignore malformed urls
	}
}

const SCROLL_STEPS = [25, 50, 75, 100]

/** Delegated listeners: outbound link clicks and scroll depth on every page. */
export function initAutoTracking(): void {
	if (typeof document === 'undefined') return
	document.addEventListener('click', (event) => {
		const anchor = (event.target as Element | null)?.closest?.('a[href]')
		if (anchor) trackOutboundClick(anchor.getAttribute('href') || '')
	})

	const reached = new Map<string, number>()
	document.addEventListener(
		'scroll',
		(event) => {
			const target = event.target as Element | Document
			const el =
				target === document ? document.documentElement : (target as HTMLElement)
			if (!el || el.scrollHeight <= el.clientHeight) return
			const percent = ((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100
			const path = globalThis.location?.pathname ?? '/'
			const done = reached.get(path) ?? 0
			for (const step of SCROLL_STEPS) {
				if (percent >= step - 1 && step > done) {
					reached.set(path, step)
					trackEvent('scroll_depth', { percent: step })
				}
			}
		},
		{ capture: true, passive: true }
	)
}

globalThis.updateConsent = updateConsent
initAutoTracking()
