import _boarder from '../assets/sprites/boarder.png'
import _opponent from '../assets/sprites/boarder-blue.png'
import _mountain from '../assets/images/mountain.png'
import _ramp from '../assets/images/ramp.png'
import _rock1 from '../assets/images/rock1.png'
import _rock2 from '../assets/images/rock2.png'

import { GAME_HCENTER, GAME_VCENTER } from '../lib/constants'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.facebook.showLoadProgress(this)
		this.facebook.once('startgame', () => { this.scene.launch('MainMenu') } , this)

		this.load.spritesheet('boarder', _boarder, {frameWidth: 26, frameHeight: 48})
		this.load.spritesheet('opponent', _opponent, {frameWidth: 26, frameHeight: 48})
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
