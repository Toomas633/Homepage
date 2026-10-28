import { API_URL } from '@/constants/env'
import type { Consent } from '@/types/cookies'
import axios from 'axios'

export type AnalyticsParams = Record<string, string | number | boolean>

let analyticsConsent = false
let adsLoaded = false

export async function loadAds(): Promise<void> {
	if (adsLoaded || typeof document === 'undefined') return
	try {
		const { data } = await axios.get(`${API_URL}/analytics/config`)
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
		.post(`${API_URL}/analytics/collect`, {
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

globalThis.updateConsent = updateConsent
