import PL, { Vec2 } from 'planck-js'

import Player from '../lib/Player'
import Hill from '../lib/Hill'
import Ramp from '../lib/Ramp'


export default class MainGame extends Phaser.Scene {
	constructor() {
		super({ key: 'MainGame', active: true })

		this.world = PL.World({
			gravity: Vec2(0, 9),
		})

		/* Physics */
		this.accumMS = 0 			// accumulated time since last update
		this.hzMS = 1 / 60 * 1000	// update frequency

		this.player = new Player(this)
		this.ramp = new Ramp(this)
	}

	preload() {
		this.player.preload()
		this.ramp.preload()
	}

	create() {
		// hill we ride on
		this.hill = new Hill(this)

		this.player.create()

		// camera set zoom level and follow me!
		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)

		this.cursors = this.input.keyboard.createCursorKeys()
		
		this.input.on('pointerdown',this.handleMouseClick, this)
		// this.world.on('begin-contact', this.handleOnCollision)
		// this.matter.world.on('collisionstart', this.handleOnCollision, this)
	}

	handleMouseClick(pointer) {
		const worldView = this.cameras.main.worldView
		const x = pointer.x + worldView.x
		const y = pointer.y + worldView.y
	
		this.ramp.create(x,y)
	}

	handleOnCollision(e) {
		console.log(e)
	}

	update(time, delta) {
		const pb = this.player.body
		const { left, right } = this.cursors

		if (left.isDown) {
			console.log('less gravity')
			pb.setGravityScale(.5)
		} else if (right.isDown) {
			console.log('more gravity')
			pb.setGravityScale(2)
		}

		this.phys(delta)
	}

	phys(delta) {
		this.accumMS += delta
		while (this.accumMS >= this.hzMS) {
			this.accumMS -= this.hzMS
			this.world.step(1/60)
			// this.player.update()
		}
	}
}
