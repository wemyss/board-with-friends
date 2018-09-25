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
	create(x = 1, y = 0) {
		const scene = this.scene

		// make a triangle for the physics body
		var vertices = []
		vertices[0] = Vec2(-1.0, 0.0)
		vertices[1] = Vec2(1.0, 0.0)
		vertices[2] = Vec2(1.0, 2.0)		
		var shape = new PL.Polygon(vertices)
		
		var fd = {}
		fd.density = 1.0
		fd.friction = 0.005
		
		var bd = {}
		bd.type = 'static'
		bd.position = Vec2(x/SCALE, y/SCALE)
		this.body = scene.world.createBody(bd)
		this.body.createFixture(shape, fd)
		scene.add.sprite(x,y,'ramp')
		
	}

	update() {
		// const {x, y} = this.body.getPosition()
		// this.obj.setPosition(x * SCALE, y * SCALE)
		// this.obj.setRotation(this.body.getAngle())
	}
}
