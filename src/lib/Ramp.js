import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'
import _ramp from '../assets/images/ramp.png'

const RAMP_WIDTH = 63
const RAMP_HEIGHT = 42
/*
Let's do stuff properly, below is some calcs to correctly
calculate the physics object placement.
1. Make shape same size as image pixel size
2. Move the object so that it's centerpoint is on the image centerpoint
3. Scale it down into physics world sizing
      C
    / |
   /  |
  /   |
 /    |
A ---- B
 */
const RAMP_POINTS = [
	Vec2(0, RAMP_HEIGHT),          // a
	Vec2(RAMP_WIDTH, RAMP_HEIGHT), // b
	Vec2(RAMP_WIDTH, 0)            // c
]
	.map(v => v.sub(Vec2(RAMP_WIDTH/2, RAMP_HEIGHT/2)))
	.map(v => v.mul(1/SCALE))

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
	 * @param {number} angle - angle of rotation for the ramp in radians
	 */
	create(x, y, angle) {
		// make a triangle for the physics body
		const shape = new PL.Polygon(RAMP_POINTS)

		this.body = this.scene.world.createBody({
			type: 'static',
			position: Vec2(x/SCALE, y/SCALE),
		})

		this.body.setAngle(angle)
		this.body.createFixture(shape, {
			density: 1.0,
			friction: 0.005,
		})
		
		this.sprite = this.scene.add.sprite(x, y, 'ramp')
		this.sprite.rotation = angle
		// this.debugRender(x, y, RAMP_POINTS)
	}

	// optional debug render to better see the ramp physics object
	debugRender(x, y, points) {
		const gx = this.scene.add.graphics()
		gx.lineStyle(1, 0xff00ff)
		gx.strokePoints(
			points.map(pnt => new Phaser.Geom.Point(x + pnt.x * SCALE, y + pnt.y * SCALE)),
			true
		)
	}

}
