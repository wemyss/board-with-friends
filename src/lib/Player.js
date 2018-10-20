import PL, { Vec2 } from 'planck-js'

import { SCALE, SPEED, PLAYER_GROUP_INDEX, HEAD_SENSOR, PLAYER_HEIGHT, PLAYER_WIDTH, BOARD_SENSOR, P1 } from './constants'
import { calculateAngle, calculateHeight } from './utils'
import LocationBar from '../lib/LocationBar'

const SPEED_ONCE_HIT = 2
const SPEED_AFTER_FALL = 3
const SENSOR_HEIGHT = 6 / SCALE // 6 in pixels

const ANGULAR_VELOCITY_ADJUSTMENT = 0.17
const MAX_ANGULAR_VELOCITY = 7

export default class Player {
	constructor(scene, color = P1) {
		this.scene = scene
		this.locationBar = new LocationBar(scene, color)

		this.rotationAngleCount = 0
		this.prevRotationAngle = 0
		this.onGround = 0
	}

	/*
	 * @param {string} sprite - spritesheet to use for the player
	 */
	create(sprite = 'boarder') {
		// planck physics body
		this.body = this.scene.world.createBody({
			position: Vec2(0, 0),
			type: 'dynamic',
			fixedRotation: false,
			mass: 1,
			restitution: 0,
		})

		// we want the player to be stable but also as close to the sprite shape as possible
		// this shape covers most of the sprite but is more square to improve stability
		// the head sensor covers the rest of the sprite
		const playerHeight = PLAYER_HEIGHT/SCALE
		const playerWidth = PLAYER_WIDTH/SCALE
		const playerShape = PL.Box(playerWidth/2, (playerHeight - SENSOR_HEIGHT)/2 )
		playerShape.m_vertices
			.forEach(v => v.add(Vec2(0, SENSOR_HEIGHT/2)))

		this.body.createFixture(playerShape, {
			friction: 0.005,
			density: 1,

			// Negative number, don't collide with other bodies with same number
			filterGroupIndex: PLAYER_GROUP_INDEX,
		})


		// create head sensor shape for fall detection
		const headSensorShape = PL.Box(playerWidth/2, SENSOR_HEIGHT/2)
		headSensorShape.m_vertices
			.forEach(v => v.sub(Vec2(0, (playerHeight - SENSOR_HEIGHT)/2))) // move the box up to the top of the player

		this.body.createFixture(headSensorShape, {
			isSensor: true,
			userData: HEAD_SENSOR
		})

		// create board sensor for flip detection
		// it is intentionally narrower than the player so it does not trigger a landing if they later fall.
		const boardSensorShape = PL.Box(playerWidth/6, SENSOR_HEIGHT/2)
		boardSensorShape.m_vertices
			.forEach(v => v.sub(Vec2(0, -(playerHeight - SENSOR_HEIGHT/2)/2))) // move the box down to the bottom of the player

		this.body.createFixture(boardSensorShape, {
			isSensor: true,
			userData: BOARD_SENSOR
		})


		// initializing variables for when the player has fallen for
		this.newAngle = 0
		this.needsToBeUprighted = false

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, sprite, 0)
		
		// Create location bar
		this.locationBar.create()
		
		// create snow flicker at the back of the player
		this.snow = this.scene.add.particles('snow').createEmitter({
			x: this.body.getPosition().x * SCALE,
			y: this.body.getPosition().y * SCALE,
			angle: { min: 170, max: 190 },
			scale: { start: 0.1, end: 0.01 },
			blendMode: 'LIGHTEN',
			lifespan: 200,
			on: false,
		})
	}


	update(endX) {
		if (!this.onGround) {
			const currentRotationAngle = this.body.getAngle()
			this.rotationAngleCount += currentRotationAngle - this.prevRotationAngle
			this.prevRotationAngle = currentRotationAngle
		}
		
		const {x, y} = this.body.getPosition()
		this.xPos = x
		this.obj.setPosition(x * SCALE, y * SCALE)

		if (this.needsToBeUprighted) {
			this.body.setAngle(this.newAngle)
			this.body.setAngularVelocity(0)
			this.needsToBeUprighted = false
			this.resetRotationCount()
		}

		// Max and min speed of player
		this.body.m_linearVelocity.x = Math.min(Math.max(this.body.m_linearVelocity.x, 2), 20)

		this.obj.setRotation(this.body.getAngle())
		
		// Update location bar (<= endX so never go above 100%)
		if (x <= endX) {
			this.locationBar.update(Math.round(x*100/endX))
		}
		
		// Create snow trailing behind player
		if (this.body.getLinearVelocity().x >= 2.5 && this.onGround) {
			var vec = Vec2.clone(this.body.getPosition())

			this.snow.setPosition(vec.x * SCALE, vec.y * SCALE + (PLAYER_HEIGHT / 2))
			this.snow.setSpeed(this.body.getLinearVelocity().x)
			this.snow.setAngle(this.body.getAngle())
			this.snow.emitParticle(3)
		}
	}


	/**
	 * Adds more angular velocity to the player to rotate them
	 */
	rotateLeft() {
		const pb = this.body
		pb.setAngularVelocity(Math.max(pb.getAngularVelocity() - ANGULAR_VELOCITY_ADJUSTMENT, -MAX_ANGULAR_VELOCITY))
	}

	rotateRight() {
		const pb = this.body
		pb.setAngularVelocity(Math.min(pb.getAngularVelocity() + ANGULAR_VELOCITY_ADJUSTMENT, MAX_ANGULAR_VELOCITY))
	}


	/**
	 * Check if actions should be performed. Arrow keys and WASD
	 * Note that the controls up/down are not mutually exclusive to the left/right controls.
	 *
	 * @param {CursorKeys} c - cursor keys object to check what buttons are down
	 */
	checkActions(c) {
		// Rotation
		if (c.LEFT.isDown || c.A.isDown) {
			this.rotateLeft()
		} else if (c.RIGHT.isDown || c.D.isDown) {
			this.rotateRight()
		}

		// Speed Up / Down
		this.body.setLinearDamping(0)
		if (c.UP.isDown || c.W.isDown) {
			this.body.setLinearDamping(0.8)
		} else if (c.DOWN.isDown || c.S.isDown) {
			if (this.body.getLinearVelocity().x < 15) {
				this.body.applyForce(new Vec2(SPEED,0), this.body.getWorldCenter())
			}
		}
	}

	resetRotationCount() {
		this.rotationAngleCount = 0
		this.prevRotationAngle = this.body.getAngle()
	}

	hitObstacle() {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_ONCE_HIT, previousVelocity.x), 0))
		this.obj.play('flicker')

		this.resetRotationCount()
	}

	fellOver(newAngle) {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_AFTER_FALL, previousVelocity.x), 0))
		this.obj.play('tumble')
		this.newAngle = newAngle
		this.needsToBeUprighted = true

		this.resetRotationCount()
	}

	/*
	 * @param {Hill} hill
	 */
	snapToHill(hill) {

		const pos = this.body.getPosition().clone()

		const {left, right} = hill.getBounds(pos.x)
		const angle = calculateAngle(left, right)

		pos.y = calculateHeight(left, right, pos.x) - (PLAYER_HEIGHT / SCALE) + SENSOR_HEIGHT

		this.body.setAngle(angle)
		this.body.setPosition(pos)
		this.obj.setRotation(angle)
		this.obj.setPosition(pos.x * SCALE, pos.y * SCALE)
	}
}
