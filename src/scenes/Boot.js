import _boarder from '../assets/sprites/boarder.png'
import _opponent from '../assets/sprites/boarder-blue.png'
import _mountain from '../assets/images/mountain.png'
import _ramp from '../assets/images/ramp.png'

import { GAME_HCENTER, GAME_VCENTER } from '../lib/constants'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.spritesheet('boarder', _boarder, {frameWidth: 26, frameHeight: 48})
		this.load.spritesheet('opponent', _opponent, {frameWidth: 26, frameHeight: 48})
		this.load.image('mountain', _mountain)
		this.load.image('ramp', _ramp)
	}

	create() {
		this.add.image(GAME_HCENTER, GAME_VCENTER, 'mountain')
	}
}
