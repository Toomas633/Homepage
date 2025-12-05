import { RouteComponent } from 'vue-router'

export interface RouteRecord {
	path: string
	component: RouteComponent
	meta: RouteMeta
}

interface RouteMeta {
	title: string
	description: string
	icon?: string
	image?: string
	keywords?: string
}
