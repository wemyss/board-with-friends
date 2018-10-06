import PL, { Vec2 } from 'planck-js'
import { SCALE } from '../lib/constants'
import Player from '../lib/Player'
import Hill from '../lib/Hill'
import { rotateVec } from '../lib/utils'
import Ramp from '../lib/Ramp'

const DEBUG_PHYSICS = false


export default class MainGame extends Phaser.Scene {
	constructor() {
		super({ key: 'MainGame' })

		/* Physics */
		this.accumMS = 0 			// accumulated time since last update
		this.hzMS = 1 / 60 * 1000	// update frequency
		this.player = new Player(this)
		this.ramp = new Ramp(this)
	}

	preload() {
		this.player.preload()
		// this.load.image('boarder', _boarder)
		this.ramp.preload()
	}
	
	create() {
		this.world = PL.World({
			gravity: Vec2(0, 9),
		})

		this.player.create()

		// camera set zoom level and follow me!
		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)
		this.cameras.main.setFollowOffset(-200)

		// hill we ride on
		this.hill = new Hill(this)
		this.cursors = this.input.keyboard.createCursorKeys()
		
		this.input.on('pointerdown',this.handleMouseClick, this)

		if (DEBUG_PHYSICS) {
			this.debugGx = this.add.graphics()
			this.debugGx.setDepth(1)
		}
	}


	handleMouseClick(pointer) {
		this.createRampAt(pointer.worldX)
	}

	// create a ramp at the given x coordinate and calculates the angle and y value to match the hill.
	// uses an adapted binary search for better performance
	createRampAt(x) {
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
		const yDiff = (list[mid].y * SCALE) - (list[mid-1].y * SCALE)
		const xDiff = (list[mid].x * SCALE) - (list[mid-1].x * SCALE)

		
		const yValue = ((yDiff/xDiff) * (x - (list[mid].x * SCALE))) + list[mid].y * SCALE
		
		// calculate the angle of the ramp on the hill
		var theta = Math.atan2(yDiff, xDiff)
		this.ramp.create(x, yValue - magicNumber, theta)
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

		if (DEBUG_PHYSICS) this.debugRender()
	}

	phys(delta) {
		this.accumMS += delta
		while (this.accumMS >= this.hzMS) {
			this.accumMS -= this.hzMS
			this.world.step(1/60)
			this.player.update()
		}
	}

	debugRender() {
		const gx = this.debugGx
		gx.clear()
		gx.lineStyle(1, 0xff00ff)

		for (let b = this.world.getBodyList(); b; b = b.getNext()) {
			for (let f = b.getFixtureList(); f; f = f.getNext()) {
				const type = f.getType()
				const shape = f.getShape()
				const pos = b.getPosition()
				const angle = b.getAngle()

				if (type === 'polygon' || type === 'chain') {
					/*
					 * 1. Rotate
					 * 2. Translate
					 * 3. Scale
					 */
					gx.strokePoints(
						shape.m_vertices
							.map(vec => rotateVec(vec, angle).add(pos).mul(SCALE))
							.map(vec => new Phaser.Geom.Point(vec.x, vec.y)),
						type === 'polygon'
					)
				} else {
					console.log('Daammmnnn... Planck has not learned that move yet.')
				}
			}
		}
	}
}
