import { HEADINGS, TEXT, INTERACTIVE_BUTTON } from '../lib/constants'
import { addButton } from '../lib/utils'
import { getScore, getHits } from '../lib/stats'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	create() {
		const hits = getHits()
		const score = getScore()

		this.add.text(200, 100, 'Gameover', {font: '80px Courier', fill: HEADINGS})

		this.score_Display = this.add.text(240, 200, 'Your Score:', {font: '36px Courier', fill: TEXT})
		this.score_Display.setText('Your Score: ' + score)

		this.hit_Display = this.add.text(220, 250, 'Objects Hit:', {font: '36px Courier', fill: TEXT})
		this.hit_Display.setText('Objects Hit: ' + hits)

		const mainMenuCallback = () => {
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			this.scene.start('MainMenu')
		}
		
		const mainMenuButton = addButton(this, 400, 380, 'button', 'blank-button', mainMenuCallback, {frameDown:'blank-button-clicked', text:'Main Menu'})
		mainMenuButton.setScale(2/3, 1/2)
	}
}
