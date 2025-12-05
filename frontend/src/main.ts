import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import VueDeviceDetect from '@basitcodeenv/vue3-device-detect'
import { createHead } from '@vueuse/head'

if (globalThis.window !== undefined) {
	const loadLeafletCSS = () => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
		link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
		link.crossOrigin = ''
		document.head.appendChild(link)
	}

	if (document.readyState === 'complete') {
		loadLeafletCSS()
	} else {
		globalThis.window.addEventListener('load', loadLeafletCSS)
	}
}

const head = createHead()

createApp(App)
	.use(Router)
	.use(Vuetify)
	.use(VueCookies)
	.use(VueDeviceDetect)
	.use(head)
	.mount('#app')
