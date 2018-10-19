import { HEADINGS, TEXT } from '../lib/constants'
import { addButton } from '../lib/utils'
import { getStats } from '../lib/stats'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	create() {
		const { falls, flips, hits, score } = getStats()
		const style = {font: '34px Courier', fill: TEXT}


		this.add.text(220, 100, 'Gameover', {font: '80px Courier', fill: HEADINGS})
		this.add.text(260, 200, 'Your score: ' + score, style)
		this.add.text(240, 250, 'Objects hit: ' + hits, style)
		this.add.text(180, 300, 'Crash landings: ' + falls, style)
		this.add.text(160, 350, 'Number of flips: ' + flips, style)

		const mainMenuCallback = () => {
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			this.scene.start('MainMenu')
		}

		const mainMenuButton = addButton(this, 400, 460, 'button', 'blank-button', mainMenuCallback, {frameDown:'blank-button-clicked', text:'Main Menu'})
		mainMenuButton.setScale(2/3, 1/2)
	}
}
