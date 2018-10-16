import _boarder from '../assets/sprites/boarder.png'
import _opponent from '../assets/sprites/boarder-blue.png'
import _mountain from '../assets/images/mountain.png'
import _ramp from '../assets/images/ramp.png'
import _rock1 from '../assets/images/rock1.png'
import _rock2 from '../assets/images/rock2.png'

import { GAME_HCENTER, GAME_VCENTER, PLAYER_HEIGHT, PLAYER_WIDTH } from '../lib/constants'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.spritesheet('boarder', _boarder, {frameWidth: PLAYER_WIDTH, frameHeight: PLAYER_HEIGHT})
		this.load.spritesheet('opponent', _opponent, {frameWidth: PLAYER_WIDTH, frameHeight: PLAYER_HEIGHT})
		this.load.image('mountain', _mountain)
		this.load.image('ramp', _ramp)

		this.load.image('rock1', _rock1)
		this.load.image('rock2', _rock2)
	}

	create() {
		this.add.image(GAME_HCENTER, GAME_VCENTER, 'mountain')

		// create animations
		this.anims.create({
			key: 'flicker',
			frames: this.anims.generateFrameNumbers('boarder', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: 5,
			yoyo: true,
		})
	}
}
