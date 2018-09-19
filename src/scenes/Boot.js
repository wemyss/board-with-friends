// Import image files
import _mountain from '../assets/images/mountain.png'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Example', active: true })
	}

	preload() {
		this.load.image('mountain', _mountain)

	}

	create() {
		// background
		this.add.image(400, 300, 'mountain')
	}
}
