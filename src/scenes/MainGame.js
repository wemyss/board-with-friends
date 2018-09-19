import PL, { Vec2 } from 'planck-js'

import Player from '../lib/Player'
import Hill from '../lib/Hill'

export default class MainGame extends Phaser.Scene {
	constructor() {
		super({ key: 'MainGame' })

		this.world = PL.World({
			gravity: Vec2(0, 9),
		})

		/* Physics */
		this.accumMS = 0 			// accumulated time since last update
		this.hzMS = 1 / 60 * 1000	// update frequency

		this.player = new Player(this)
	}

	preload() {
		this.player.preload()
	}

	create() {
		this.hill = new Hill(this)
		this.player.create()

		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)

		this.cursors = this.input.keyboard.createCursorKeys()
	}



	update(time, delta) {
		const pb = this.player.body

		const { left, right, up, down } = this.cursors

		if (left.isDown) {
			console.log('slower')
			pb.setGravityScale(.5)
		} else if (right.isDown) {
			console.log('faster')
			pb.setGravityScale(2)
		}


		this.phys(delta)
	}


	phys(delta) {
		this.accumMS += delta;
		while (this.accumMS >= this.hzMS) {
			this.accumMS -= this.hzMS
			this.world.step(1/60)
			this.player.update()
		}
	}
}
