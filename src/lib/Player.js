import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'


export default class Player {
	constructor(scene) {
		this.scene = scene
	}

	/*
	 * @param {number} x - horizontal position of the object in the world
	 * @param {number} y - vertical position of the object in the world
	 */
	create(x = 1, y = 0) {
		const scene = this.scene

		// planck physics body
		this.body = scene.world.createBody({
			position: Vec2(x, y),
			type: 'dynamic',
			fixedRotation: false,
			mass: 1,
			restitution: 0,
		})
		this.body.createFixture(PL.Box(1, .75), {
			friction: 0.005,
			density: 1,

			// Negative number, don't collide with other bodies with same number
			filterGroupIndex: -1,
		})

		// phaser game object for the player
		this.obj = scene.add.sprite(0, 0, 'boarder', 0)
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.obj.setPosition(x * SCALE, y * SCALE)
		this.obj.setRotation(this.body.getAngle())
	}


	/*
	 * @param {CursorKeys} c - cursor keys object to check what buttons are down
	 * @return {Boolean} - true if an action was performed, otherwise false
	 */
	checkActions(c) {
		if (c.left.isDown) {
			console.log('less gravity')
			this.body.setGravityScale(.5)
			return true
		} else if (c.right.isDown) {
			console.log('more gravity')
			this.body.setGravityScale(2)
			return true
		}

		return false
	}
}
