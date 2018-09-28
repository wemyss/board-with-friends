import PL, { Vec2 } from 'planck-js'
import { SCALE } from '../lib/constants'

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

		this.player.create()

		// camera set zoom level and follow me!
		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)

		// hill we ride on
		this.hill = new Hill(this)
		this.cursors = this.input.keyboard.createCursorKeys()

		this.input.on('pointerdown',this.handleMouseClick, this)
	}

	handleMouseClick(pointer) {
		console.log(pointer.worldX, pointer.worldY)
		console.log(this.hill.body)

		// calculate the y coordinate on the hill to place the ramp
		const yValue = this.findYValue(pointer.worldX)
		this.ramp.create(pointer.worldX, yValue)
	}

	// TODO: update this search to a binary or other fast search.
	findYValue(x) {
		const magicAdjustment = 10 // to adjust for the offset on the ramp object
		const list = this.hill.body.m_fixtureList.m_shape.m_vertices
		for (var i = 0; i < list.length; i++) {
			if (list[i].x * SCALE > x) {
				return (list[i].y * SCALE) - magicAdjustment
			}
		}

	}

	handleOnCollision(e) {
		console.log(e)
	}

	update(time, delta) {
		const pb = this.player.body
		const { left, right, up } = this.cursors

		if (left.isDown) {
			console.log('less gravity')
			pb.setGravityScale(.5)
		} else if (right.isDown) {
			console.log('more gravity')
			pb.setGravityScale(2)
		} else if (up.isDown) {
			// Only works if you modify the package.json in node_modules/planck-js to have
			// "main" point to "dist/planck-with-testbed.js"
			// PL.testbed(testbed => this.world)
		}

		this.phys(delta)
	}

	phys(delta) {
		this.accumMS += delta
		while (this.accumMS >= this.hzMS) {
			this.accumMS -= this.hzMS
			this.world.step(1/60)
			this.player.update()
		}
	}
}
