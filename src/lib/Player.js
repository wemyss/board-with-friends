import PL, { Vec2 } from 'planck-js'

import { SCALE } from './constants'
import _dude from '../assets/sprites/dude.png'


export default class Player {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		this.scene.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 })
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
			mass: .5,
			restitution: 0
		})
		this.body.createFixture(PL.Box(.5, .75), {
			friction: 0.005
		})


		// phaser game object for the player
		this.obj = scene.add.sprite(0, 0, 'dude')


		// animations
		scene.anims.create({
			key: 'left',
			frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		scene.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		})
		scene.anims.create({
			key: 'right',
			frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.obj.setPosition(x * SCALE, y * SCALE)
		this.obj.setRotation(this.body.getAngle())
	}
}
