// For in game menu layer that gets fixed to background
import { INTERACTIVE_BUTTON, TEXT, GREY, LOCATION_BAR_START } from '../lib/constants'
import { getScore } from '../lib/stats'
import * as music from '../lib/Music'


export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	create() {
		// Quit button that stick to camera
		this.quitButton = this.add.text(30, 20, 'Quit', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.stop('EndGame')
			music.stopGameMusic()
			this.scene.start('MainMenu')
		})

		this.scoreText = this.add.text(30, 60, 'Score: 0', { font: '36px Courier', fill: TEXT })

		// placeholder for progress bar
		this.progressBox = this.add.graphics()
		this.progressBox.fillStyle(GREY, 0.2)
		this.progressBox.fillRect(LOCATION_BAR_START, 30, 200, 16)
		this.progressBox.setScrollFactor(0)
	}

	update() {
		this.scoreText.setText('Score: ' + getScore())
	}
}
