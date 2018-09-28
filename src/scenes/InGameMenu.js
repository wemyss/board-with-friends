// For in game menu layer that gets fixed to background

var score
var hits

export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	preload() {
	}

	create() {
		score = 0
		hits = 0
		// Quit button that stick to camera
		this.quitButton = this.add.text(30, 20, 'Quit', {font: '36px Courier', fill: '#466E85'})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.start('MainMenu')
		})

		this.scoreText = this.add.text(30, 60, 'Score: ' + score, { font: '36px Courier', fill: '#000' })
		this.timedEvent = this.time.addEvent({		//Score update every 1 second
			delay: 1000,
			callback: this.addScore,
			loop: true
		})
		this.input.on('pointerdown', () => { //Temporary - clicks for objects hit
			hits += 1
		})
	}

	addScore() {
		score += 10 //Temporary - increment for score
	}

	update() {
		this.scoreText.setText('Score: ' + score)
		if (score >= 50) { //Temporary - To end the game quicker
			this.scene.stop('MainGame')
			this.scene.start('EndGame', {score, hits})
		}
	}
}
