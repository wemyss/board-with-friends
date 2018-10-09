// For in game menu layer that gets fixed to background
import { INTERACTIVE_BUTTON, TEXT } from '../lib/constants'
import { getScore } from '../lib/stats'

var score

export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	create() {
		score = 0
		// Quit button that stick to camera
		this.quitButton = this.add.text(30, 20, 'Quit', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.start('MainMenu')
		})

		this.scoreText = this.add.text(30, 60, 'Score: ' + score, { font: '36px Courier', fill: TEXT })
		this.timedEvent = this.time.addEvent({		//Score update every 1 second
			delay: 1000,
			callback: this.addScore,
			loop: true
		})
	}

	addScore() {
		score += 10 //Temporary - increment for score
	}

	update() {
		this.scoreText.setText('Score: ' + getScore())
	}
}
