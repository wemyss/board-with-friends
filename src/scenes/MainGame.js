import PL, { Vec2 } from 'planck-js'

import Player from '../lib/Player'
import Multiplayer from '../lib/Multiplayer'
import Hill from '../lib/Hill'
import Ramp from '../lib/Ramp'

import { SCALE, OBSTACLE_GROUP_INDEX, HEAD_SENSOR, HILL_TAG, HIT_OBSTACLE_POINT_DEDUCTION, FAILED_LANDING_POINT_DEDUCTION, RAMP_WIDTH, HZ_MS, BOARD_SENSOR, P1, PLAYER_GROUP_INDEX, GAME_HCENTER, GAME_HEIGHT, GAME_WIDTH } from '../lib/constants'
import { rotateVec, calculateAngle } from '../lib/utils'
import * as stats from '../lib/stats'
import * as music from '../lib/Music'

const DEBUG_PHYSICS = false


export default class MainGame extends Phaser.Scene {
	constructor() {
		super({ key: 'MainGame' })

		/* Physics */
		this.accumMS = 0 		// accumulated time since last update
		this.hzMS = HZ_MS		// update frequency
	}

	init(state) {
		this.world = PL.World({
			gravity: Vec2(0, 7),
		})

		this.snowEmitter = this.add.particles('snow')

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
			this.player = new Player(this, P1)
		}

		// It is created here so that the updated Math.seed() comes into effect
		this.hill = new Hill(this)
		this.ramp = new Ramp(this)
	}

	create() {
		this.player.create()
		music.pauseMenuMusic()
		music.startGameMusic()

		// camera set zoom level and follow me!
		this.cameras.main.setZoom(1)
		this.cameras.main.startFollow(this.player.obj)
		this.cameras.main.setFollowOffset(-GAME_HCENTER/2)

		// hill we ride on
		this.hill.create()
		this.player.snapToHill(this.hill)

		// non touch devices get a keyboard and mouse, touch devices get hot spots
		if (!this.sys.game.device.input.touch && false) {
			this.cursors = this.input.keyboard.addKeys('W,A,S,D,UP,LEFT,RIGHT,DOWN')
			for (const key in this.cursors) {
				// HACK: fix keys stuck on when quitting game while holding down key and restarting
				this.cursors[key].isDown = false
			}

			this.input.on('pointerdown', this.handleMouseClick, this)
			this.input.keyboard.on('keyup_SPACE', this.placeRampInFrontOfPlayer, this)
		} else {
			this.buildMobileControls()
		}

		if (DEBUG_PHYSICS) {
			this.debugGx = this.add.graphics()
			this.debugGx.setDepth(1)
		}



		// Show in game menu
		this.scene.launch('InGameMenu')

		// Set world listeners for collisions
		this.world.on('begin-contact', (e) => {this.handleBeginContact(e)}, this)
		this.world.on('end-contact', (e) => {this.handleEndContact(e)}, this)

		// Make sure all our stats are 0 at the start of the game
		stats.resetAll()
	}

	handleBeginContact(e) {
		const fixtureA = e.getFixtureA()
		const fixtureB = e.getFixtureB()

		// check for obstacle collision
		// for more details on the 'on the ground' detection: http://www.iforce2d.net/b2dtut/jumpability
		if (fixtureA.m_filterGroupIndex === PLAYER_GROUP_INDEX && fixtureA.m_body === this.player.body
						&& fixtureB.m_filterGroupIndex === OBSTACLE_GROUP_INDEX) {
			this.player.hitObstacle()
			stats.reduceScore(HIT_OBSTACLE_POINT_DEDUCTION)
			stats.increaseHits()
		} else if (fixtureA.m_userData === HILL_TAG && fixtureB.m_body === this.player.body
						&& fixtureB.m_userData === HEAD_SENSOR) {
			// When the player's head is touching the ground then they have fallen over
			const {left, right} = this.hill.getBounds(this.player.body.getPosition().x)
			const newAngle = calculateAngle(left, right)
			this.player.fellOver(newAngle)
			stats.reduceScore(FAILED_LANDING_POINT_DEDUCTION)
			stats.increaseFalls()
		} else if (fixtureA.m_userData === HILL_TAG && fixtureB.m_body === this.player.body
						&& fixtureB.m_userData === BOARD_SENSOR) {
			if (!this.player.onGround) {
				// We weren't on the ground, but we will be now
				const numFlips = Math.round(Math.abs(this.player.rotationAngleCount / (2 * Math.PI)))
				if (DEBUG_PHYSICS) console.log(`You did ${numFlips} flips!`)
				stats.addFlips(numFlips)
			}

			// Add ground contact
			this.player.onGround++
		}
	}

	handleEndContact(e) {
		const fixtureA = e.getFixtureA()
		const fixtureB = e.getFixtureB()

		if (fixtureA.m_userData === HILL_TAG && fixtureB.m_body === this.player.body
						&& fixtureB.m_userData === BOARD_SENSOR) {
			// Subtract ground contact
			this.player.onGround--

			if (!this.player.onGround) {
				// we're just taking off
				this.player.resetRotationCount()
			}
		}
	}

	handleMouseClick(pointer) {
		// calculate the y coordinate on the hill to place the ramp
		const x = pointer.worldX / SCALE
		const bounds = this.hill.getBounds(x)

		if (bounds === null) return

		this.ramp.create(x, bounds)
	}

	placeRampInFrontOfPlayer() {
		const x = this.player.xPos + (2 * RAMP_WIDTH / SCALE)
		const bounds = this.hill.getBounds(x)
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

			this.player.update(this.hill.endX)

			// End of game if player x position past field of view of camera
			if (this.player.xPos > this.hill.endX + 1.5 * GAME_HCENTER / SCALE) {
				this.scene.stop('MainGame')
				this.scene.stop('InGameMenu')
				this.scene.launch('EndGame')
			}	else if (this.player.xPos > this.hill.endX) {
				// so player slide off camera view
				this.cameras.main.stopFollow(this.player.obj)
			}
		}
	}

	buildMobileControls() {
		this.input.addPointer(2)
		// only emitting events from the top-most Game Objects in the Display List
		this.input.topOnly = true

		this.cursors = {
			'UP': { isDown: false },
			'LEFT': { isDown: false },
			'RIGHT': { isDown: false },
			'DOWN': { isDown: false },
			'W': {},
			'A': {},
			'S': {},
			'D': {},
		}

		const pointerDown = key => {
			this.cursors[key].isDown = true
		}
		const pointerUp = key => {
			this.cursors[key].isDown = false
		}

		const SIZE = 160

		const createBtn = (key, x, y, width=SIZE, height=SIZE) => {
			const rec = this.add.rectangle(x, y, width, height, 0xff0000, 0.07).setOrigin(0,0)
			rec.setInteractive()
			rec.setScrollFactor(0)
			rec.on('pointerdown', () => pointerDown(key))
			rec.on('pointerup', () => pointerUp(key))
		}

		// create ramp placement button
		const rec = this.add.rectangle(0, 100, GAME_WIDTH, GAME_HEIGHT-100, 0x00ff00, 0.0).setOrigin(0,0)
		rec.setInteractive()
		rec.setScrollFactor(0)
		rec.on('pointerdown', this.handleMouseClick, this)


		// create player control buttons
		createBtn('LEFT', 0, GAME_HEIGHT-SIZE)
		createBtn('RIGHT', SIZE + 20, GAME_HEIGHT-SIZE)
		createBtn('UP', GAME_WIDTH-(2*SIZE)-20, GAME_HEIGHT-SIZE)
		createBtn('DOWN', GAME_WIDTH-SIZE, GAME_HEIGHT-SIZE)
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
