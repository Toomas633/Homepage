export interface HomelabSpec {
	label: string
	value: string
}

export interface HomelabService {
	name: string
	icon: string
	color?: string
}

export interface HomelabComponent {
	id: string
	name: string
	type: string
	location: string
	link?: {
		text: string
		href: string
	}
	specs: HomelabSpec[]
	services: HomelabService[]
}
