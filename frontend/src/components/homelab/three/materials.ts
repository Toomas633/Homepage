import {
	CanvasTexture,
	Color,
	MeshBasicMaterial,
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

/** Vertical slot vent texture, staggered columns, for Dell bezel grilles. */
export function slotVentTexture(bg: string, slot: string): CanvasTexture {
	const canvas = makeCanvas(256, 128)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = bg
		ctx.fillRect(0, 0, 256, 128)
		ctx.fillStyle = slot
		for (let row = 0; row < 2; row++) {
			const y = 10 + row * 64
			const offset = row % 2 === 1 ? 16 : 0
			for (let x = 6 + offset; x < 256; x += 32) {
				ctx.beginPath()
				ctx.roundRect(x, y, 11, 44, 5)
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

/** Hexagonal honeycomb mesh texture for Dell 13G front bezels. */
export function hexMeshTexture(bg: string, hole: string): CanvasTexture {
	const size = 256
	const canvas = makeCanvas(size, size)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = bg
		ctx.fillRect(0, 0, size, size)
		const r = 7
		const stepX = r * 1.9
		const stepY = r * 1.65
		ctx.fillStyle = hole
		for (let row = 0; row * stepY < size + stepY; row++) {
			const offset = (row % 2) * (stepX / 2)
			for (let col = 0; col * stepX < size + stepX; col++) {
				const cx = col * stepX + offset
				const cy = row * stepY
				ctx.beginPath()
				for (let k = 0; k < 6; k++) {
					const a = (Math.PI / 3) * k + Math.PI / 6
					const px = cx + Math.cos(a) * r * 0.78
					const py = cy + Math.sin(a) * r * 0.78
					if (k === 0) ctx.moveTo(px, py)
					else ctx.lineTo(px, py)
				}
				ctx.closePath()
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

/** Dell 2.5" caddy face: grid of square vent holes in a framed tray front. */
export function caddyFaceTexture(): CanvasTexture {
	const w = 160
	const h = 480
	const canvas = makeCanvas(w, h)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = '#26272b'
		ctx.fillRect(0, 0, w, h)
		// recessed inner panel
		ctx.fillStyle = '#1f2024'
		ctx.fillRect(14, 14, w - 28, h - 28)
		// grid of square vent holes with a lower highlight edge for depth
		const cols = 4
		const rows = 12
		const cellW = (w - 36) / cols
		const cellH = (h - 44) / rows
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const x = 18 + c * cellW + cellW * 0.14
				const y = 22 + r * cellH + cellH * 0.14
				const hw = cellW * 0.72
				const hh = cellH * 0.62
				ctx.fillStyle = '#0c0d10'
				ctx.fillRect(x, y, hw, hh)
				ctx.fillStyle = 'rgba(255,255,255,0.22)'
				ctx.fillRect(x, y + hh, hw, 2.5)
			}
		}
		// subtle frame highlight
		ctx.strokeStyle = 'rgba(255,255,255,0.1)'
		ctx.lineWidth = 2
		ctx.strokeRect(3, 3, w - 6, h - 6)
	}
	const texture = new CanvasTexture(canvas)
	texture.colorSpace = SRGBColorSpace
	return texture
}

/** Round Dell-style badge: blue disc with white wordmark. */
export function dellBadgeTexture(): CanvasTexture {
	const canvas = makeCanvas(128, 128)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.clearRect(0, 0, 128, 128)
		ctx.fillStyle = '#2b2d31'
		ctx.beginPath()
		ctx.arc(64, 64, 60, 0, Math.PI * 2)
		ctx.fill()
		ctx.strokeStyle = '#9ba0a8'
		ctx.lineWidth = 6
		ctx.stroke()
		ctx.fillStyle = '#c5cad1'
		ctx.font = 'bold 42px Arial'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText('DELL', 64, 66)
	}
	const texture = new CanvasTexture(canvas)
	texture.colorSpace = SRGBColorSpace
	return texture
}

/** Radial black blob with transparent falloff for contact shadows. */
export function contactShadowTexture(): CanvasTexture {
	const canvas = makeCanvas(128, 128)
	const ctx = canvas.getContext('2d')
	if (ctx) {
		const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
		gradient.addColorStop(0, 'rgba(0,0,0,0.85)')
		gradient.addColorStop(0.55, 'rgba(0,0,0,0.4)')
		gradient.addColorStop(1, 'rgba(0,0,0,0)')
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, 128, 128)
	}
	return new CanvasTexture(canvas)
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

/** Unlit, tone-mapping-exempt material for LED dots and light rings. */
export function led(color: string): MeshBasicMaterial {
	const material = new MeshBasicMaterial({ color: new Color(color) })
	material.toneMapped = false
	return material
}
