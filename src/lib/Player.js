import PL, { Vec2 } from 'planck-js'

import { SCALE, PLAYER_GROUP_INDEX } from './constants'
import LocationBar from '../lib/LocationBar'

const SPEED_ONCE_HIT = 2
const VELOCITY_ADJUSTMENT = 0.23
const MIN_VELOCITY = -8
const MAX_VELOCITY = 8
const PLAYER_WIDTH = 0.75
const PLAYER_HEIGHT = 0.75
const ROTATE_TIMEOUT = 2

export default class Player {
	constructor(scene, id) {
		this.scene = scene
		this.rotateTimeout = 0
		this.id = id
		this.locationBar = new LocationBar(scene, id)
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

		// phaser game object for the player
		this.obj = this.scene.add.sprite(0, 0, sprite, 0)
		
		// Create location bar
		this.locationBar.create()
		
	}

	update(endX) {
		if (this.rotateTimeout > 0) this.rotateTimeout--
		const {x, y} = this.body.getPosition()
		this.xPos = x
		this.obj.setPosition(x * SCALE, y * SCALE)
		this.obj.setRotation(this.body.getAngle())
		
		// Update location bar (<= endX so never go above 100%)
		if (x <= endX) {
			this.locationBar.update(Math.round(x*100/endX))
		}
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
	 * @param {CursorKeys} c - cursor keys object to check what buttons are down
	 * @return {Boolean} - true if an action was performed, otherwise false
	 */
	checkActions(c) {
		var changeFlag = false
		if (c.left.isDown) {
			this.rotateLeft()
			changeFlag = true
		} else if (c.right.isDown) {
			this.rotateRight()
			changeFlag = true
		} 
		
		if (c.up.isDown) {
			console.log('less gravity')
			this.body.setGravityScale(.5)
			changeFlag = true
		} else if (c.down.isDown) {
			console.log('more gravity')
			this.body.setGravityScale(2)
			changeFlag = true
		}

		return changeFlag
	}

	hitObstacle() {
		const previousVelocity = this.body.getLinearVelocity()
		this.body.setLinearVelocity(Vec2(Math.min(SPEED_ONCE_HIT, previousVelocity.x), 0))
		this.obj.play('flicker')
	}
}
