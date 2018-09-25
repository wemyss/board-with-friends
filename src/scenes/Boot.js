import _mountain from '../assets/images/mountain.png'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.image('mountain', _mountain)
	}

	create() {
		this.add.image(400, 300, 'mountain')
	}
}
