import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'

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

	/*
	 * @param {number} x - horizontal position of the object in the world
	 * @param {Object} bounds - object containing 'left' and 'right' vertices that bound this ramps center on the hill
	 */
	create(x, bounds) {
		const {left, right} = bounds
		const v = right.clone().sub(left)
		const angle = Math.atan2(right.y - left.y, right.x - left.x)

		// there is some bad math here since I'm not 100% sure what the image is pivoting on, so depending on the pivot angle it can slightly higher or lower on the slope than normal
		const y = ((v.y / v.x) * (x - left.x) + left.y) -  ((RAMP_HEIGHT/3) / SCALE)


		// make a triangle for the physics body
		const shape = new PL.Polygon(RAMP_POINTS)

		this.body = this.scene.world.createBody({
			type: 'static',
			position: Vec2(x, y),
			angle,
		})

		this.body.createFixture(shape, {
			density: 1.0,
			friction: 0.005,
		})
		this.obj = this.scene.add.sprite(x * SCALE, y * SCALE, 'ramp')
		this.obj.setRotation(this.body.getAngle())
	}
}
