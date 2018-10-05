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
export function addButton(scene, x, y, key, frameUp, frameDown) {
	const button = scene.add.sprite(x, y, key, frameUp)

	button.setInteractive()
	button.on('pointerdown', () => {
		button.setFrame(frameDown)
	})
	button.on('pointerup', () => {
		button.setFrame(frameUp)
	})
	button.on('pointerout', () => {
		button.setFrame(frameUp)
	})

	return button
}