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
		// calculate the y coordinate on the hill to place the ramp
		const yValue = this.findYValue(pointer.worldX)
		this.ramp.create(pointer.worldX, yValue)
	}

	// uses an adapted binary search for better performance
	findYValue(x) {
		const magicNumber = 8
		const list = this.hill.body.m_fixtureList.m_shape.m_vertices
		var mid
		var left = 0
		var right = list.length - 1
		
		// binary search algorithm for performance boost
		while (left < right){
			mid = Math.floor((left + right) / 2)
			if (list[mid].x * SCALE < x) {
				left = mid + 1
			} else {
				right = mid - 1
			}
		}

		if (mid == 0) {
			mid++
		}
		// calculate the (x,y) value between the two vertices
		const yDiff = (list[mid-1].y * SCALE) - (list[mid].y * SCALE)
		const xDiff = (list[mid-1].x * SCALE) - (list[mid].x * SCALE)
		const yValue = ((yDiff/xDiff) * (x - (list[mid].x * SCALE))) + list[mid].y * SCALE
		return yValue - magicNumber
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
			this.player.update()
		}
	}
}
