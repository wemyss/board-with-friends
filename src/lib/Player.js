import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'

const SPEED_ONCE_HIT = 2

export default class Player {
	constructor(scene) {
		this.scene = scene
	}

	/*
	 * @param {number} x - horizontal position of the object in the world
	 * @param {number} y - vertical position of the object in the world
	 */
	create(x = 1, y = 0) {
		// planck physics body
		this.body = this.scene.world.createBody({
			position: Vec2(x, y),
			type: 'dynamic',
			fixedRotation: false,
			mass: 1,
			restitution: 0,
		})
		this.body.createFixture(PL.Box(1, .75), {
			friction: 0.005,
			density: 1,
		})

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, 'boarder', 0)
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.obj.setPosition(x * SCALE, y * SCALE)
		this.obj.setRotation(this.body.getAngle())
	}

	hitObstacle() {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_ONCE_HIT, previousVelocity.x), 0))
		this.obj.play('flicker')
	}
}
