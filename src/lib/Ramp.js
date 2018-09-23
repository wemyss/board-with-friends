import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'
import _ramp from '../assets/images/ramp.png' // todo: update this to the ramp asset


export default class Ramp {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		this.scene.load.spritesheet('ramp', _ramp, { frameWidth: 32, frameHeight: 48 })	
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
			type: 'static',
		})
		this.body.createFixture(PL.Box(.5, .75), {
			friction: 0.005
		})

		// phaser game object for the ramp
		this.obj = scene.add.image(x, y, 'ramp')
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.obj.setPosition(x * SCALE, y * SCALE)
		this.obj.setRotation(this.body.getAngle())
	}
}
