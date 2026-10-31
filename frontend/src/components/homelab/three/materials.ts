import {
	CanvasTexture,
	Color,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	RepeatWrapping,
	SRGBColorSpace,
} from 'three'

function makeCanvas(width: number, height: number) {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

/** Fine brushed-metal texture used for aluminium faces. */
export function brushedTexture(base: string, streak: string): CanvasTexture {
	const canvas = makeCanvas(256, 256)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = base
		ctx.fillRect(0, 0, 256, 256)
		ctx.strokeStyle = streak
		ctx.lineWidth = 1
		for (let i = 0; i < 380; i++) {
			const y = Math.random() * 256
			ctx.globalAlpha = 0.04 + Math.random() * 0.08
			ctx.beginPath()
			ctx.moveTo(0, y)
			ctx.lineTo(256, y + (Math.random() - 0.5) * 2)
			ctx.stroke()
		}
	}
	const texture = new CanvasTexture(canvas)
	texture.wrapS = RepeatWrapping
	texture.wrapT = RepeatWrapping
	texture.colorSpace = SRGBColorSpace
	return texture
}

/** Perforated vent texture (round holes) for server fronts and mesh fillers. */
export function perforatedTexture(
	bg: string,
	hole: string,
	pitch = 16
): CanvasTexture {
	const canvas = makeCanvas(256, 256)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = bg
		ctx.fillRect(0, 0, 256, 256)
		ctx.fillStyle = hole
		for (let y = pitch / 2; y < 256; y += pitch) {
			const offset = (Math.floor(y / pitch) % 2) * (pitch / 2)
			for (let x = pitch / 2; x < 256 + pitch; x += pitch) {
				ctx.beginPath()
				ctx.arc(x + offset, y, pitch * 0.3, 0, Math.PI * 2)
				ctx.fill()
			}
		}
	}
	const texture = new CanvasTexture(canvas)
	texture.wrapS = RepeatWrapping
	texture.wrapT = RepeatWrapping
	texture.colorSpace = SRGBColorSpace
	return texture
}

/** Vertical strip of square rack-rail mounting holes, three per U. */
export function railHoleTexture(units: number): CanvasTexture {
	const holeSize = 18
	const uPx = 64
	const canvas = makeCanvas(64, uPx * units)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = '#232327'
		ctx.fillRect(0, 0, 64, uPx * units)
		for (let unit = 0; unit < units; unit++) {
			for (let hole = 0; hole < 3; hole++) {
				const y = unit * uPx + 6 + hole * 20
				ctx.fillStyle = '#08080a'
				ctx.fillRect(32 - holeSize / 2, y, holeSize, holeSize)
				ctx.strokeStyle = 'rgba(255,255,255,0.14)'
				ctx.strokeRect(32 - holeSize / 2, y, holeSize, holeSize)
			}
		}
	}
	const texture = new CanvasTexture(canvas)
	texture.colorSpace = SRGBColorSpace
	return texture
}

/** Text label texture (brand tags, model names). */
export function labelTexture(
	text: string,
	options: {
		bg?: string
		fg?: string
		font?: string
		width?: number
		height?: number
	} = {}
): CanvasTexture {
	const {
		bg = 'transparent',
		fg = '#c9ccd2',
		font = 'bold 28px Arial',
		width = 256,
		height = 48,
	} = options
	const canvas = makeCanvas(width, height)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		if (bg !== 'transparent') {
			ctx.fillStyle = bg
			ctx.fillRect(0, 0, width, height)
		}
		ctx.fillStyle = fg
		ctx.font = font
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(text, width / 2, height / 2)
	}
	const texture = new CanvasTexture(canvas)
	texture.colorSpace = SRGBColorSpace
	return texture
}

export function steel(color: string, roughness = 0.55): MeshStandardMaterial {
	return new MeshStandardMaterial({
		color: new Color(color),
		metalness: 0.75,
		roughness,
	})
}

export function paintedSteel(
	color: string,
	roughness = 0.7
): MeshStandardMaterial {
	return new MeshStandardMaterial({
		color: new Color(color),
		metalness: 0.35,
		roughness,
	})
}

export function plastic(color: string, roughness = 0.5): MeshStandardMaterial {
	return new MeshStandardMaterial({
		color: new Color(color),
		metalness: 0.02,
		roughness,
	})
}

export function glass(tint = '#0c0d10', opacity = 0.55): MeshPhysicalMaterial {
	return new MeshPhysicalMaterial({
		color: new Color(tint),
		metalness: 0,
		roughness: 0.08,
		transparent: true,
		opacity,
		clearcoat: 1,
		clearcoatRoughness: 0.06,
	})
}

export function emissive(color: string, intensity = 1.6): MeshStandardMaterial {
	return new MeshStandardMaterial({
		color: new Color('#0a0a0a'),
		emissive: new Color(color),
		emissiveIntensity: intensity,
		roughness: 0.4,
		metalness: 0,
	})
}
