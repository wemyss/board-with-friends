import PL, { Vec2 } from 'planck-js'

import { SCALE, PLAYER_GROUP_INDEX, HEAD_SENSOR, PLAYER_HEIGHT, PLAYER_WIDTH } from './constants'

const SPEED_ONCE_HIT = 2
const SENSOR_HEIGHT = 0.1875 // 6 in pixels

export default class Player {
	constructor(scene) {
		this.scene = scene
	}

	/*
	 * @param {string} sprite - spritesheet to use for the player
	 * @param {number} x - horizontal position of the object in the world
	 * @param {number} y - vertical position of the object in the world
	 */
	create(sprite = 'boarder', x = 1, y = 0) {
		// planck physics body
		this.body = this.scene.world.createBody({
			position: Vec2(x, y),
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

		// local variables
		this.touchingGround = 0
		this.newAngle = 0

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, sprite, 0)
	}

	update() {
		const {x, y} = this.body.getPosition()
		this.obj.setPosition(x * SCALE, y * SCALE)

		if (this.needsToBeUprighted) {
			this.body.setAngle(this.newAngle)
			this.body.setAngularVelocity(0)
			this.needsToBeUprighted = false
		}

		this.obj.setRotation(this.body.getAngle())
	}

	/*
	 * @param {CursorKeys} c - cursor keys object to check what buttons are down
	 * @return {Boolean} - true if an action was performed, otherwise false
	 */
	checkActions(c) {
		if (c.left.isDown) {
			console.log('less gravity')
			this.body.setGravityScale(.5)
			return true
		} else if (c.right.isDown) {
			console.log('more gravity')
			this.body.setGravityScale(2)
			return true
		}

		return false
	}

	hitObstacle() {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_ONCE_HIT, previousVelocity.x), 0))
		this.obj.play('flicker')
	}

	fellOver(newAngle) {
		// FIXME
		this.hitObstacle()
		this.newAngle = newAngle
		this.needsToBeUprighted = true
	}
}
