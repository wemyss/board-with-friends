import _mountain from '../assets/images/mountain.png'
import _boarder from '../assets/sprites/boarder.png'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.image('mountain', _mountain)
		this.load.spritesheet('boarder', _boarder, {frameWidth: 26, frameHeight: 48})
	}

	create() {
		this.add.image(400, 300, 'mountain')

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
