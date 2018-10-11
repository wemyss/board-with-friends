import PL, { Vec2 } from 'planck-js'

import { SCALE, PLAYER_GROUP_INDEX, BOARD_SENSOR } from './constants'

const PLAYER_HEIGHT = 0.75
const PLAYER_WIDTH = 1
const SPEED_ONCE_HIT = 2

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
		this.body.createFixture(PL.Box(PLAYER_WIDTH, PLAYER_HEIGHT), {
			friction: 0.005,
			density: 1,

			// Negative number, don't collide with other bodies with same number
			filterGroupIndex: PLAYER_GROUP_INDEX,
		})

		// create sensor shape
		var bottomSensorShape = PL.Box(PLAYER_WIDTH - 0.05, 0.1) 
		bottomSensorShape.m_vertices
			.map(v => v.sub(Vec2(0, -PLAYER_HEIGHT))) // move the box down to the bottom of the player

		const bottomSensor = this.body.createFixture(bottomSensorShape)
		bottomSensor.m_isSensor = true
		bottomSensor.m_userData = BOARD_SENSOR

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
			this.body.setAngle(this.newAngle) // TODO: update this to the angle of the hill
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

	facePlanted(newAngle) {
		this.hitObstacle()
		this.newAngle = newAngle
		this.needsToBeUprighted = true
	}
}
