import { HomelabComponent } from '@/types/homelab'

export const homelabComponents: HomelabComponent[] = [
	{
		id: 'rack',
		name: 'VEVOR 15U Open Frame Server Rack',
		type: '4-post open frame network rack',
		location: 'Rack frame',
		link: {
			text: 'VEVOR product page',
			href: 'https://eur.vevor.com/server-rack-c_10750/vevor-15u-open-frame-server-rack-15-40-adjustable-depth-free-standing-or-wall-mount-network-server-rack-4-post-av-rack-with-casters-holds-all-your-networking-it-equipment-av-gear-router-modem-p_010932296808',
		},
		specs: [
			{ label: 'Form factor', value: '15U, 19" 4-post open frame' },
			{ label: 'Depth', value: '15"–40" adjustable' },
			{ label: 'Mounting', value: 'Free standing on lockable casters' },
			{ label: 'Material', value: 'SPCC cold-rolled steel' },
		],
		services: [],
	},
	{
		id: 'r730',
		name: 'Dell PowerEdge R730',
		type: '2U rack server',
		location: 'Slots U1–U2',
		specs: [
			{ label: 'CPU', value: '2× Intel Xeon E5-2682 v4 (16C/32T, 2.5 GHz)' },
			{ label: 'Memory', value: '64 GB DDR4 ECC RDIMM' },
			{ label: 'Storage', value: '16× 2.5" SFF hot-swap bays' },
			{ label: 'Cooling', value: '6× hot-swap fans' },
			{ label: 'Power', value: 'Dual hot-plug PSUs' },
		],
		services: [],
	},
	{
		id: 'patch-panel',
		name: 'Patch panel',
		type: '1U 24-port keystone patch panel',
		location: 'Slot U10',
		specs: [
			{ label: 'Ports', value: '24× RJ45 keystone' },
			{ label: 'Category', value: 'Cat6' },
		],
		services: [],
	},
	{
		id: 'unifi-switch',
		name: 'UniFi US-8-150W',
		type: 'Managed PoE switch',
		location: 'Slot U11',
		specs: [
			{ label: 'Ports', value: '8× GbE RJ45 + 2× SFP' },
			{ label: 'PoE budget', value: '150 W (802.3af/at + 24V passive)' },
			{ label: 'Switching capacity', value: '20 Gbps' },
			{
				label: 'Mounting',
				value: 'Original metal bracket + 3D printed mesh filler bar',
			},
		],
		services: [],
	},
	{
		id: 'lipo-drawer',
		name: 'LiPo charging drawer',
		type: '1U pull-out drawer',
		location: 'Slot U13',
		specs: [
			{ label: 'Charger', value: 'SkyRC iMAX B6 balance charger' },
			{ label: 'Batteries', value: '2× 4S LiPo packs' },
			{ label: 'Rails', value: 'Full extension drawer slides' },
		],
		services: [],
	},
	{
		id: 'shelf',
		name: 'Rack shelf',
		type: '1U cantilever shelf',
		location: 'Slot U14',
		specs: [
			{ label: 'Form factor', value: '1U, 19" rack mount' },
			{ label: 'Material', value: 'Steel, black powder coat' },
		],
		services: [],
	},
	{
		id: 'power-bar',
		name: 'Infitronic INSV1001',
		type: '19" power distribution strip',
		location: 'Slot U15',
		link: {
			text: 'Amazon product page',
			href: 'https://www.amazon.de/-/en/Infitronic-INSV1001-Aluminium-Distribution-Network/dp/B08MKSK5TL',
		},
		specs: [
			{ label: 'Outlets', value: '9× Schuko sockets' },
			{ label: 'Switch', value: 'Illuminated 2-pole power switch' },
			{ label: 'Housing', value: 'Aluminium, 1U 19" rack mount' },
		],
		services: [],
	},
	{
		id: 'bambu-p2s',
		name: 'Bambu Lab P2S',
		type: 'CoreXY 3D printer',
		location: 'Top of rack',
		specs: [
			{ label: 'Build volume', value: '256 × 256 × 256 mm' },
			{ label: 'Max toolhead speed', value: '500 mm/s' },
			{ label: 'Enclosure', value: 'Fully enclosed, glass door' },
		],
		services: [],
	},
	{
		id: 'ams-2-pro',
		name: 'Bambu Lab AMS 2 Pro',
		type: 'Automatic material system',
		location: 'On top of the P2S',
		specs: [
			{ label: 'Capacity', value: '4 filament spools' },
			{ label: 'Drying', value: 'Active filament drying up to 65 °C' },
		],
		services: [],
	},
	{
		id: 'ac-pro',
		name: 'UniFi AC Pro',
		type: '802.11ac Wi-Fi access point',
		location: 'Right side of rack',
		specs: [
			{ label: 'Wi-Fi', value: '802.11ac, 3×3 MIMO' },
			{ label: 'Throughput', value: '450 Mbps (2.4 GHz) + 1300 Mbps (5 GHz)' },
			{ label: 'Power', value: '802.3af PoE / 48V passive' },
		],
		services: [],
	},
]
