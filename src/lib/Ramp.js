import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'
import _ramp from '../assets/images/ramp.png'

export default class Ramp {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		this.scene.load.image('ramp', _ramp)
	}

	/*
	 * @param {number} x - horizontal position of the object in the world
	 * @param {number} y - vertical position of the object in the world
	 */
	create(x, y) {

		const points = [
			Vec2(-1.0, 1.0),
			Vec2(0.5, 1.0),
			Vec2(0.5, 0.0)
		]

		// make a triangle for the physics body
		const shape = new PL.Polygon(points)

		this.body = this.scene.world.createBody({
			type: 'static',
			position: Vec2(x/SCALE, y/SCALE),
		})

		this.body.createFixture(shape, {
			density: 1.0,
			friction: 0.005,
		})
		this.scene.add.sprite(x, y, 'ramp')

		this.debugRender(x, y, points)
	}

	debugRender(x, y, points) {
		const gx = this.scene.add.graphics()
		gx.lineStyle(1, 0xff00ff)
		gx.strokePoints(
			points.map(pnt => new Phaser.Geom.Point(x + pnt.x * SCALE, y + pnt.y * SCALE)),
			true
		)
	}

	update() {
		// const {x, y} = this.body.getPosition()
		// this.obj.setPosition(x * SCALE, y * SCALE)
		// this.obj.setRotation(this.body.getAngle())
	}
}
