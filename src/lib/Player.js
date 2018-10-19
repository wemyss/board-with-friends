import PL, { Vec2 } from 'planck-js'

import { SCALE, SPEED, PLAYER_GROUP_INDEX, HEAD_SENSOR, PLAYER_HEIGHT, PLAYER_WIDTH } from './constants'
import { calculateAngle, calculateHeight } from './utils'

const SPEED_ONCE_HIT = 2
const SPEED_AFTER_FALL = 3
const SENSOR_HEIGHT = 6 / SCALE // 6 in pixels

const ANGULAR_VELOCITY_ADJUSTMENT = 0.17
const MAX_ANGULAR_VELOCITY = 7

export default class Player {
	constructor(scene) {
		this.scene = scene
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


		// create sensor shape
		const headSensorShape = PL.Box(playerWidth/2, SENSOR_HEIGHT/2)
		headSensorShape.m_vertices
			.forEach(v => v.sub(Vec2(0, (playerHeight - SENSOR_HEIGHT)/2))) // move the box up to the top of the player

		this.body.createFixture(headSensorShape, {
			isSensor: true,
			userData: HEAD_SENSOR
		})

		// initializing variables for when the player has fallen for
		this.newAngle = 0
		this.needsToBeUprighted = false

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, sprite, 0)
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.xPos = x
		this.obj.setPosition(x * SCALE, y * SCALE)

		if (this.needsToBeUprighted) {
			this.body.setAngle(this.newAngle)
			this.body.setAngularVelocity(0)
			this.needsToBeUprighted = false
		}

		// Max and min speed of player
		this.body.m_linearVelocity.x = Math.min(Math.max(this.body.m_linearVelocity.x, 2), 20)

		this.obj.setRotation(this.body.getAngle())
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

	hitObstacle() {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_ONCE_HIT, previousVelocity.x), 0))
		this.obj.play('flicker')
	}

	fellOver(newAngle) {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_AFTER_FALL, previousVelocity.x), 0))
		this.obj.play('tumble')
		this.newAngle = newAngle
		this.needsToBeUprighted = true
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
