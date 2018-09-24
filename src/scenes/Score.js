/*
This whole thing can just be added to the MainGame to make life easier,
depending when i can do it without ruining someone elses work LOL
*/
var score = 0
var hits = 0

export default class Score extends Phaser.Scene {
	constructor() {
		super({ key: 'Score', active: true })
	}

	create() {
		this.scoreText = this.add.text(16, 16, 'Score: 0', { font: '36px Courier', fill: '#000' })
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
			this.scene.pause('MainGame')
			this.scene.moveBelow('endGame')
			this.scene.start('endGame', {score: score, hits: hits})
		}
	}
}
