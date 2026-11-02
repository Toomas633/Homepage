import {
	BoxGeometry,
	Group,
	Material,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
} from 'three'
import { labelTexture } from '../materials'

export function tag(group: Group, id: string) {
	group.userData.deviceId = id
	group.traverse((child) => {
		child.userData.deviceId = id
	})
}

export function shadows(group: Group) {
	group.traverse((child) => {
		if (child instanceof Mesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

export function box(w: number, h: number, d: number, material: Material): Mesh {
	return new Mesh(new BoxGeometry(w, h, d), material)
}

export function label(
	text: string,
	w: number,
	h: number,
	options: Parameters<typeof labelTexture>[1] = {}
): Mesh {
	const mesh = new Mesh(
		new PlaneGeometry(w, h),
		new MeshStandardMaterial({
			map: labelTexture(text, options),
			transparent: true,
			roughness: 0.6,
			metalness: 0,
		})
	)
	return mesh
}
