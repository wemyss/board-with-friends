import PL, { Vec2 } from 'planck-js'

import { SCALE, SPEED, PLAYER_GROUP_INDEX, HEAD_SENSOR, PLAYER_HEIGHT, PLAYER_WIDTH, BOARD_SENSOR } from './constants'
import { calculateAngle, calculateHeight } from './utils'

const SPEED_ONCE_HIT = 2
const SPEED_AFTER_FALL = 3
const SENSOR_HEIGHT = 0.1875 // 6 in pixels

const VELOCITY_ADJUSTMENT = 0.23
const MIN_VELOCITY = -8
const MAX_VELOCITY = 8
const ROTATE_TIMEOUT = 2

export default class Player {
	constructor(scene) {
		this.scene = scene
		
		// Rotation local variables
		this.rotateTimeout = 0
		this.rotationAngleCount = 0
		this.prevRotationAngle = 0
		this.onGround = false
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
		const boardSensorShape = PL.Box(playerWidth/4, SENSOR_HEIGHT/2)
		boardSensorShape.m_vertices
			.forEach(v => v.sub(Vec2(0, -(playerHeight - SENSOR_HEIGHT)/2))) // move the box down to the bottom of the player

		this.body.createFixture(boardSensorShape, {
			isSensor: true,
			userData: BOARD_SENSOR
		})


		// initializing variables for when the player has fallen for
		this.newAngle = 0
		this.needsToBeUprighted = false

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, sprite, 0)
	}

	update() {
		if (this.rotateTimeout > 0) this.rotateTimeout--
		if (!this.onGround) {
			const currentRotationAngle = this.body.getAngle()
			this.rotationAngleCount += currentRotationAngle - this.prevRotationAngle
			this.prevRotationAngle = currentRotationAngle
		} else {
			this.rotationAngleCount = 0
			this.prevRotationAngle = this.body.getAngle()
		}

		const {x, y} = this.body.getPosition()
		this.xPos = x
		this.obj.setPosition(x * SCALE, y * SCALE)

		if (this.needsToBeUprighted) {
			this.body.setAngle(this.newAngle)
			this.body.setAngularVelocity(0)
			this.needsToBeUprighted = false
		}

		this.obj.setRotation(this.body.getAngle())
	}


	/**
	 * Adds more angular velocity to the player to rotate them
	 */
	rotateLeft() {
		if (this.rotateTimeout === 0) {
			let pb = this.body
			pb.setAngularVelocity(Math.max(pb.getAngularVelocity() - VELOCITY_ADJUSTMENT, MIN_VELOCITY))
			this.rotateTimeout = ROTATE_TIMEOUT
		}
	}

	rotateRight() {
		if (this.rotateTimeout === 0) {
			let pb = this.body
			pb.setAngularVelocity(Math.min(pb.getAngularVelocity() + VELOCITY_ADJUSTMENT, MAX_VELOCITY))
			this.rotateTimeout = ROTATE_TIMEOUT
		}
	}



	/**
	 * Check if actions should be performed.
	 * Note that the controls up/down are not mutually exclusive to the left/right controls.
	 *
	 * @param {CursorKeys} c - cursor keys object to check what buttons are down
	 * @return {Boolean} - true if an action was performed, otherwise false
	 */
	checkActions(c) {
		var accelerationVec = this.body.getLinearVelocity().x
		var changeFlag = false
		if (c.left.isDown) {
			this.rotateLeft()
			changeFlag = true
		} else if (c.right.isDown) {
			this.rotateRight()
			changeFlag = true
		}

		if (c.up.isDown) {
			this.body.setLinearDamping(1)

			if (accelerationVec >= 2) {
				accelerationVec -= SPEED
			} else {
				accelerationVec = 2
			}

			this.body.applyForce(new Vec2(accelerationVec,0), this.body.getWorldCenter())
			changeFlag = true
		} else if (c.down.isDown) {
			this.body.setLinearDamping(0.3)

			if (accelerationVec < 20) {
				accelerationVec += SPEED
			} else {
				accelerationVec = 20
			}

			this.body.applyForce(new Vec2(accelerationVec,0), this.body.getWorldCenter())
			changeFlag = true
		}

		return changeFlag
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
