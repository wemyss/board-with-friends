import { HEADINGS, TEXT } from '../lib/constants'
import { addButton } from '../lib/utils'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	init(data) {
		this.score = localStorage.getItem('score')
		this.hits = data.hits
	}

	create() {
		this.add.text(200, 100, 'Gameover', {font: '80px Courier', fill: HEADINGS})

		this.score_Display = this.add.text(240, 200, 'Your Score:', {font: '36px Courier', fill: TEXT})
		this.score_Display.setText('Your Score: ' + this.score)

		this.hit_Display = this.add.text(220, 250, 'Objects Hit:', {font: '36px Courier', fill: TEXT})
		this.hit_Display.setText('Objects Hit: ' + this.hits)

		const mainMenuCallback = () => {
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			this.scene.start('MainMenu')
		}
		
		const mainMenuButton = addButton(this, 400, 380, 'button', 'blank-button', mainMenuCallback, {frameDown:'blank-button-clicked', text:'Main Menu'})
		mainMenuButton.setScale(2/3, 1/2)
	}
}
