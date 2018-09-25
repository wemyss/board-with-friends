import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'
import _ramp from '../assets/images/ramp.png'

export default class Ramp {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		this.scene.load.image('ramp', _ramp, { frameWidth: 32, frameHeight: 48 })
	}

	/*
	 * @param {number} x - horizontal position of the object in the world
	 * @param {number} y - vertical position of the object in the world
	 */
	create(x, y) {

		// make a triangle for the physics body
		const shape = new PL.Polygon([
			Vec2(-1.0, 1.0),
			Vec2(0.5, 1.0),
			Vec2(0.5, 0.0)
		])

		this.body = this.scene.world.createBody({
			type: 'static',
			position: Vec2(x/SCALE, y/SCALE),
		})

		this.body.createFixture(shape, {
			density: 1.0,
			friction: 0.005,
		})
		this.scene.add.sprite(x, y, 'ramp')

	}

	update() {
		// const {x, y} = this.body.getPosition()
		// this.obj.setPosition(x * SCALE, y * SCALE)
		// this.obj.setRotation(this.body.getAngle())
	}
}
