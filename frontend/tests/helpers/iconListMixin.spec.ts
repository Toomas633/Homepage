import { describe, it, expect } from 'vitest'

import useIconListMixin from '../../src/helpers/iconListMixin'

describe('iconListMixin', () => {
	it('should return createPreset and iconListPresets', () => {
		const mixin = useIconListMixin()

		expect(mixin).toHaveProperty('createPreset')
		expect(mixin).toHaveProperty('iconListPresets')
		expect(typeof mixin.createPreset).toBe('function')
		expect(typeof mixin.iconListPresets).toBe('object')
	})

	describe('createPreset', () => {
		it('should merge preset and input while keeping preset icon', () => {
			const { createPreset } = useIconListMixin()
			const buildItem = createPreset({
				icon: 'mdi-test-icon',
				color: '#123456',
				title: 'Preset Title',
			})

			const item = buildItem({ text: 'Hello' })

			expect(item).toEqual({
				icon: 'mdi-test-icon',
				color: '#123456',
				title: 'Preset Title',
				text: 'Hello',
			})
		})

		it('should prefer input color over preset color', () => {
			const { createPreset } = useIconListMixin()
			const buildItem = createPreset({
				icon: 'mdi-test-icon',
				color: '#123456',
			})

			const item = buildItem({ text: 'Hello', color: '#000000' })

			expect(item.color).toBe('#000000')
		})

		it('should fall back to preset color when input color is undefined', () => {
			const { createPreset } = useIconListMixin()
			const buildItem = createPreset({
				icon: 'mdi-test-icon',
				color: '#123456',
			})

			const item = buildItem({ text: 'Hello', color: undefined })

			expect(item.color).toBe('#123456')
		})

		it('should allow input to override preset title and include extra fields', () => {
			const { createPreset } = useIconListMixin()
			const buildItem = createPreset({
				icon: 'mdi-test-icon',
				color: '#123456',
				title: 'Preset Title',
			})

			const item = buildItem({
				text: 'Hello',
				title: 'Input Title',
				href: 'https://example.com',
			})

			expect(item).toMatchObject({
				icon: 'mdi-test-icon',
				color: '#123456',
				title: 'Input Title',
				text: 'Hello',
				href: 'https://example.com',
			})
		})
	})

	describe('iconListPresets', () => {
		it('should include all expected presets', () => {
			const { iconListPresets } = useIconListMixin()

			expect(iconListPresets).toHaveProperty('typeScript')
			expect(iconListPresets).toHaveProperty('testing')
			expect(iconListPresets).toHaveProperty('docker')
			expect(iconListPresets).toHaveProperty('express')
			expect(iconListPresets).toHaveProperty('codeQuality')
			expect(iconListPresets).toHaveProperty('vue')
			expect(iconListPresets).toHaveProperty('vuetify')
			expect(iconListPresets).toHaveProperty('vite')
			expect(iconListPresets).toHaveProperty('vueRouter')
			expect(iconListPresets).toHaveProperty('axios')
			expect(iconListPresets).toHaveProperty('leaflet')
			expect(iconListPresets).toHaveProperty('nodeJs')
			expect(iconListPresets).toHaveProperty('esbuild')
			expect(iconListPresets).toHaveProperty('nodemailer')
			expect(iconListPresets).toHaveProperty('swaggerUi')
			expect(iconListPresets).toHaveProperty('security')
			expect(iconListPresets).toHaveProperty('python')
			expect(iconListPresets).toHaveProperty('configFile')
		})

		it.each([
			['typeScript', 'mdi-language-typescript', '#3178c6', 'TypeScript'],
			['testing', 'mdi-test-tube', '#6e9f18', 'Testing'],
			['docker', 'mdi-docker', '#2496ed', 'Docker'],
			['express', 'mdi-rocket-launch', '#ff9800', 'Express'],
			['codeQuality', 'mdi-check-decagram', '#7e57c2', 'Code quality'],
			['vue', 'mdi-vuejs', '#42b883', 'Vue'],
			['vuetify', 'mdi-view-dashboard', '#1867c0', 'Vuetify'],
			['vite', 'mdi-flash', '#646cff', 'Vite'],
			['vueRouter', 'mdi-routes', '#673ab7', 'Vue Router'],
			['axios', 'mdi-web', '#5a29e4', 'Axios'],
			['leaflet', 'mdi-map', '#199900', 'Leaflet'],
			['nodeJs', 'mdi-nodejs', '#339933', 'Node.js'],
			['esbuild', 'mdi-hammer-wrench', '#ffcf00', 'esbuild'],
			['nodemailer', 'mdi-email', '#1e88e5', 'Nodemailer'],
			['swaggerUi', 'mdi-api', '#85ea2d', 'Swagger UI'],
			['security', 'mdi-shield-lock', '#f9a825', 'Security'],
			['python', 'mdi-language-python', '#3776ab', 'Python'],
			['configFile', 'mdi-file-cog', '#fb8c00', 'Config'],
		])(
			'%s preset should generate items with expected icon, color, and title',
			(presetName, expectedIcon, expectedColor, expectedTitle) => {
				const { iconListPresets } = useIconListMixin()
				const builder =
					iconListPresets[presetName as keyof typeof iconListPresets]
				const item = builder({ text: 'Hello' })

				expect(item.icon).toBe(expectedIcon)
				expect(item.color).toBe(expectedColor)
				expect(item.title).toBe(expectedTitle)
				expect(item.text).toBe('Hello')
			}
		)

		it('should allow preset title to be overridden per item', () => {
			const { iconListPresets } = useIconListMixin()
			const item = iconListPresets.docker({
				title: 'Containerized',
				text: 'Docker support',
			})

			expect(item.icon).toBe('mdi-docker')
			expect(item.title).toBe('Containerized')
		})

		it('should allow preset color to be overridden per item', () => {
			const { iconListPresets } = useIconListMixin()
			const item = iconListPresets.docker({
				text: 'Docker',
				color: '#ffffff',
			})

			expect(item.icon).toBe('mdi-docker')
			expect(item.color).toBe('#ffffff')
		})
	})
})
