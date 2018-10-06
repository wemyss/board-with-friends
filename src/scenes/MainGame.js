import PL, { Vec2 } from 'planck-js'

import Player from '../lib/Player'
import MultiPlayer from '../lib/MultiPlayer'
import Hill from '../lib/Hill'
import Ramp from '../lib/Ramp'

import { SCALE } from '../lib/constants'
import { rotateVec } from '../lib/utils'

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

	init(state) {
		const { isMultiplayer, gameId, opponents, socket } = state

		if (isMultiplayer) {
			// Very important for generating the same run across players
			Math.seed = gameId.charCodeAt(0)

			this.player = new MultiPlayer(this, gameId, opponents, socket)

			// disconnent socket from server on scene shutdown
			this.events.on('shutdown', this.player.shutdown, this.player)
		} else {
			Math.seed = Math.random()
			this.player = new Player(this)
		}
	}

	create() {
		this.world = PL.World({
			gravity: Vec2(0, 6),
		})

		this.player.create()

		// camera set zoom level and follow me!
		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)
		this.cameras.main.setFollowOffset(-200)

		// hill we ride on
		this.hill = new Hill(this)

		// up, down, left, right, space and shift
		this.cursors = this.input.keyboard.createCursorKeys()

		if (DEBUG_PHYSICS) {
			this.debugGx = this.add.graphics()
			this.debugGx.setDepth(1)
		}

		this.input.on('pointerdown', this.handleMouseClick, this)

		// Show in game menu
		this.scene.launch('InGameMenu')
	}

	handleMouseClick(pointer) {
		// calculate the y coordinate on the hill to place the ramp
		const x = pointer.worldX / SCALE
		const bounds = this.hill.getBounds(x)

		if (bounds === null) return

		this.ramp.create(x, bounds)
	}

	update(time, delta) {
		this.player.checkActions(this.cursors)

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
