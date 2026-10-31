/**
 * Shared geometry constants for the CSS 3D homelab rack visualisation.
 * All values are pixels. Scale is roughly 0.68 px per mm so a 1U
 * (44.45 mm) rack unit maps to 30 px.
 */
export const U = 30
export const RACK_UNITS = 15
/** Width of a 19" (482.6 mm) faceplate */
export const FACE_W = 330
/** Width of an equipment body that fits between the rails (450 mm) */
export const BODY_W = 300
/** Width of a rack post profile */
export const POST_W = 24
/** Depth of a rack post profile */
export const POST_D = 16
/** Distance between the front and rear post planes */
export const RACK_D = 400
/** Height of the top and bottom frame beams */
export const FRAME_H = 20
/** Height of a caster incl. mounting plate */
export const CASTER_H = 34
/** Total height of the rail opening (15U) */
export const RAILS_H = U * RACK_UNITS

/**
 * Top offset (px, y axis pointing down) of a device mounted in the
 * given slot, relative to the top of the rails. Slot 1 is the lowest
 * unit, slot 15 the highest.
 */
export function slotTop(slot: number, units = 1): number {
	return RAILS_H - (slot + units - 1) * U
}
