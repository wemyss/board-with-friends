import { INTERACTIVE_BUTTON, HEADINGS } from '../lib/constants'

export default class MainMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MainMenu', active: true })
	}

	preload() {
	}

	create() {
		this.add.text(150, 100, 'Main Menu', {font: '80px Courier', fill: HEADINGS})
		// Play button
		this.playButton = this.add.text(350, 250, 'Play', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
		this.playButton.setInteractive()
		this.playButton.on('pointerdown', () => {
			this.scene.start('MainGame')
		})

		this.optionButton = this.add.text(350, 350, 'Options', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
	}

	update() {
	}
}
