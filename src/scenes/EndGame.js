import { INTERACTIVE_BUTTON, HEADINGS, TEXT } from '../lib/constants'
import { getScore, getHits } from '../lib/stats'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	create() {
		const hits = getHits()
		const score = getScore()

		this.add.text(200, 100, 'Gameover', {font: '80px Courier', fill: HEADINGS})
		this.add.image(400, 400, 'background').setAlpha(0.2)

		this.score_Display = this.add.text(240, 200, 'Your Score:', {font: '36px Courier', fill: TEXT})
		this.score_Display.setText('Your Score: ' + score)

		this.hit_Display = this.add.text(220, 250, 'Objects Hit:', {font: '36px Courier', fill: TEXT})
		this.hit_Display.setText('Objects Hit: ' + hits)

		this.mainMenu = this.add.text(150, 400, 'Main Menu', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
		this.mainMenu.setInteractive()
		this.mainMenu.on('pointerdown', () => {
			this.scene.start('MainMenu')
		})

		//Swaps to highScore scene
		this.highScore = this.add.text(450, 400, 'High Score', {font: '36px Courier', fill: INTERACTIVE_BUTTON})
		this.highScore.setInteractive()
		this.highScore.on('pointerdown', () => {
			this.scene.start('HighScore')
		})
	}
}
