import PL, { Vec2 } from 'planck-js'

import { SCALE, RAMP_WIDTH, RAMP_HEIGHT } from './constants'
import { calculateAngle, calculateHeight } from './utils'


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
	 * @param {Number} x - horizontal position of the object in the world
	 * @param {Object} bounds - object containing 'left' and 'right' vertices that bound this ramps center on the hill
	 */
	create(x, bounds) {
		const {left, right} = bounds
		const angle = calculateAngle(left, right)

		const y = calculateHeight(left, right, x) -  ((RAMP_HEIGHT/2) / SCALE)

		if (this.body) {
			// move it rather than creating another
			this.move(angle, {x, y})
			return
		}

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
		// render behind the hill rocks, and trees
		this.obj.setDepth(-1)

		this.obj.setRotation(this.body.getAngle())
	}

	/*
	 * Moves the ramp body and the sprite to be at the new placement location
	 * @param {Number} angle
	 * @param {Object} pos - object containing x and y coordinates {x, y}
	 */
	move(angle, pos) {
		this.body.setPosition(pos)
		this.body.setAngle(angle)

		this.obj.setPosition(pos.x * SCALE, pos.y * SCALE)
		this.obj.setRotation(angle)
	}
}
