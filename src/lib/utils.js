import { Vec2 } from 'planck-js'

/*
 * Rotate a vector
 *
 * @param {Vec2} v - vector to rotate
 * @param {Number} angle - angle in radians to rotate the vector
 *
 * TODO: Remove this and use Mat22 in Planck.js - not available currently in 0.2.4
 */
export function rotateVec(v, angle) {
	const x = Math.cos(angle) * v.x - Math.sin(angle) * v.y
	const y = Math.sin(angle) * v.x + Math.cos(angle) * v.y
	return Vec2.neo(x, y)
}
