import PL, { Vec2 } from 'planck-js'

import Player from '../lib/Player'
import Multiplayer from '../lib/Multiplayer'
import Hill from '../lib/Hill'
import Ramp from '../lib/Ramp'

import { SCALE, OBSTACLE_GROUP_INDEX, HEAD_SENSOR, HILL_TAG, HIT_OBSTACLE_POINT_DEDUCTION, FAILED_LANDING_POINT_DEDUCTION } from '../lib/constants'
import { rotateVec, calculateAngle } from '../lib/utils'
import * as stats from '../lib/stats'

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
			// NOTE: same game ids will produce the same game this way
			Math.seed = gameId.charCodeAt(4)

			this.player = new Multiplayer(this, gameId, opponents, socket)

			// disconnent socket from server on scene shutdown
			this.events.on('shutdown', this.player.shutdown, this.player)
		} else {
			Math.seed = Math.random()
			this.player = new Player(this)
		}

		// It is created here so that the updated Math.seed() comes into effect
		this.hill = new Hill(this)
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
		this.hill.create()

		this.cursors = this.input.keyboard.createCursorKeys()

		if (DEBUG_PHYSICS) {
			this.debugGx = this.add.graphics()
			this.debugGx.setDepth(1)
		}

		this.input.on('pointerdown', this.handleMouseClick, this)

		// Show in game menu
		this.scene.launch('InGameMenu')

		// Set world listeners for collisions
		this.world.on('begin-contact', (e) => {
			const fixtureA = e.getFixtureA()
			const fixtureB = e.getFixtureB()

			// check for obstacle collision
			// for more details on the 'on the ground' detection: http://www.iforce2d.net/b2dtut/jumpability
			if (fixtureA.m_body === this.player.body && fixtureB.m_filterGroupIndex === OBSTACLE_GROUP_INDEX) {
				this.player.hitObstacle()
				stats.reduceScore(HIT_OBSTACLE_POINT_DEDUCTION)
				stats.increaseHits()
			} else if (fixtureA.m_userData === HILL_TAG && fixtureB.m_userData === HEAD_SENSOR) {
				// When the player's head is touching the ground then they have fallen over
				const {left, right} = this.hill.getBounds(this.player.body.getPosition().x)
				const newAngle = calculateAngle(left, right)
				this.player.fellOver(newAngle)
				stats.reduceScore(FAILED_LANDING_POINT_DEDUCTION)
				stats.increaseFalls()
			}
		})

		// Make sure our points are at 0 at the start of a game
		stats.resetScore()
		stats.resetHits()
		stats.resetFalls()
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

		stats.setDistance(this.player.body.getPosition().x)

		this.phys(delta)

		if (DEBUG_PHYSICS) this.debugRender()
	}

	phys(delta) {
		this.accumMS += delta
		while (this.accumMS >= this.hzMS) {
			this.accumMS -= this.hzMS
			this.world.step(1/60)
			this.player.update()
			// End of game if player's x position past last hill segment x position
			if (this.player.xPos > (this.hill.endX + 20)) {
				this.scene.stop('MainGame')
				this.scene.stop('InGameMenu')
				this.scene.launch('EndGame')
			}	else if (this.player.xPos > this.hill.endX) {
				this.cameras.main.stopFollow(this.player.obj) // so player slide off camera view
			}
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
