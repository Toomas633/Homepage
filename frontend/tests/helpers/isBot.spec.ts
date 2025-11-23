import { describe, it, expect } from 'vitest'
import { isBotUserAgent } from '../../src/helpers/isBot'

describe('isBot', () => {
	describe('isBotUserAgent', () => {
		it('should detect common bot user agents', () => {
			const botUserAgents = [
				'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
				'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
				'facebookexternalhit/1.1',
				'Twitterbot/1.0',
				'LinkedInBot/1.0',
				'Slackbot 1.0',
				'curl/7.64.1',
				'python-requests/2.28.0',
			]

			for (const ua of botUserAgents) {
				expect(isBotUserAgent(ua)).toBe(true)
			}
		})

		it('should not detect regular browsers as bots', () => {
			const regularUserAgents = [
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
			]

			for (const ua of regularUserAgents) {
				expect(isBotUserAgent(ua)).toBe(false)
			}
		})

		it('should handle empty or undefined user agents', () => {
			expect(isBotUserAgent('')).toBe(false)
		})

		it('should be case insensitive', () => {
			expect(isBotUserAgent('GOOGLEBOT')).toBe(true)
			expect(isBotUserAgent('Bot')).toBe(true)
			expect(isBotUserAgent('CRAWLER')).toBe(true)
		})
	})
})
