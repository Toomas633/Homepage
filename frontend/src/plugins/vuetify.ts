import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.min.css'
import '@/assets/scss/style.scss'

const sharedVariables = {
	'high-emphasis-opacity': 0.92,
	'medium-emphasis-opacity': 0.68,
	'disabled-opacity': 0.38,
	'idle-opacity': 0.04,
	'hover-opacity': 0.06,
	'focus-opacity': 0.12,
	'selected-opacity': 0.1,
	'activated-opacity': 0.12,
	'pressed-opacity': 0.14,
	'dragged-opacity': 0.08,
}

const darkTheme = {
	dark: true,
	colors: {
		background: '#141416',
		surface: '#1c1c20',
		'surface-bright': '#26262c',
		'surface-light': '#232329',
		'surface-variant': '#2e2e36',
		'on-surface-variant': '#e6e6ea',
		primary: '#f44336',
		'primary-darken-1': '#c62828',
		secondary: '#26262c',
		accent: '#ff7043',
		error: '#ff5252',
		info: '#42a5f5',
		success: '#66bb6a',
		warning: '#ffa726',
	},
	variables: {
		...sharedVariables,
		'border-color': '#ffffff',
		'border-opacity': 0.1,
		'theme-kbd': '#26262c',
		'theme-on-kbd': '#FFFFFF',
		'theme-code': '#1a1a1e',
		'theme-on-code': '#e8e8ec',
	},
}

const lightTheme = {
	dark: false,
	colors: {
		background: '#f4f4f7',
		surface: '#ffffff',
		'surface-bright': '#ffffff',
		'surface-light': '#fafafc',
		'surface-variant': '#e6e6ec',
		'on-surface-variant': '#2a2a30',
		primary: '#f44336',
		'primary-darken-1': '#d32f2f',
		secondary: '#e8e8ee',
		accent: '#ff7043',
		error: '#e53935',
		info: '#1e88e5',
		success: '#43a047',
		warning: '#fb8c00',
	},
	variables: {
		...sharedVariables,
		'border-color': '#0b0b10',
		'border-opacity': 0.1,
		'theme-kbd': '#ececf2',
		'theme-on-kbd': '#000000',
		'theme-code': '#f1f1f6',
		'theme-on-code': '#1b1b20',
	},
}

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	defaults: {
		VCard: {
			rounded: 'xl',
		},
		VBtn: {
			rounded: 'pill',
		},
		VChip: {
			rounded: 'pill',
		},
		VTextField: {
			variant: 'outlined',
			rounded: 'lg',
		},
		VTextarea: {
			variant: 'outlined',
			rounded: 'lg',
		},
		VSelect: {
			variant: 'outlined',
			rounded: 'lg',
		},
		VAutocomplete: {
			variant: 'outlined',
			rounded: 'lg',
		},
		VDataTable: {
			hover: true,
		},
		VTooltip: {
			location: 'top',
		},
	},
	theme: {
		defaultTheme: 'darkTheme',
		themes: {
			darkTheme,
			lightTheme,
		},
	},
	components: {},
})
