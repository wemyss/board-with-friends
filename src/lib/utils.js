import { Vec2 } from 'planck-js'
import { BUTTON_TEXTSTYLE } from '../lib/constants'

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

/*
 * Calculate the y value at x between two vertices
 *
 * @param {Vec2} left - vertex to the left
 * @param {Vec2} right - vertex to the right
 * @param {float} x - position x between the two vertices
 *
 * @return {float} the height of the hill between the vertices
 */
export function calculateHeight(left, right, x) {
	const v = right.clone().sub(left)
	return ((v.y / v.x) * (x - left.x) + left.y)
}

/*
 * Calculate the angle between two vertices
 *
 * @param {Vec2} left - vertex to the left
 * @param {Vec2} right - vertex to the right
 *
 * @return {float} the angle of the hill between the vertices
 */
export function calculateAngle(left, right) {
	return Math.atan2(right.y - left.y, right.x - left.x)
}

/*
 * A helper function to add a button to a scene
 *
 * @param scene - the scene to add the button to
 * @param x - x position of the button in the scene
 * @param y - y position of the button in the scene
 * @param key - key of the texture atlas to use
 * @param frameUp - the frame in the atlas to use when the button is not pressed
 * @param frameDown - the frame in the atlas to use when the button is pressed
 *
 */
export function addButton(scene, x, y, key, frameUp, callback, options) {
	const CENTER = 0.5
	const button = scene.add.sprite(x, y, key, frameUp)

	button.setInteractive()

	button.on('pointerup', () => {
		button.setFrame(frameUp)
		callback()
	})

	// if we have a frame defined for the 'clicked' state, register pointer events
	if (options.frameDown) {
		button.on('pointerdown', () => {
			button.setFrame(options.frameDown)
		})

		// make sure after a click that we return to the normal state of the button
		button.on('pointerout', () => {
			button.setFrame(frameUp)
		})
	}

	if (options.text) {
		scene.add.text(x, y - 5, options.text, BUTTON_TEXTSTYLE).setOrigin(CENTER)
	}
	return button
}