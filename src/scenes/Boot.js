import _mountain from '../assets/images/mountain.png'
import _boarder from '../assets/sprites/boarder.png'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.spritesheet('boarder', _boarder, {frameWidth: 26, frameHeight: 48})
		this.load.image('mountain', _mountain)
	}

	create() {
		this.add.image(400, 300, 'mountain')
	}
}
