import { HEADINGS, TEXT } from '../lib/constants'
import { addButton } from '../lib/utils'
import { getScore, getHits, getFalls } from '../lib/stats'
import * as music from '../lib/Music'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	create() {
		const hits = getHits()
		const score = getScore()
		const falls = getFalls()

		this.add.text(200, 100, 'Gameover', {font: '80px Courier', fill: HEADINGS})

		this.score_Display = this.add.text(240, 200, 'Your Score:', {font: '36px Courier', fill: TEXT})
		this.score_Display.setText('Your Score: ' + score)

		this.hit_Display = this.add.text(220, 250, 'Objects Hit:', {font: '36px Courier', fill: TEXT})
		this.hit_Display.setText('Objects Hit: ' + hits)

		this.hit_Display = this.add.text(155, 300, 'Crash landings:', {font: '36px Courier', fill: TEXT})
		this.hit_Display.setText('Crash landings: ' + falls)

		const mainMenuCallback = () => {
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			music.stopGameMusic()
			this.scene.start('MainMenu')
		}

		const mainMenuButton = addButton(this, 400, 410, 'button', 'blank-button', mainMenuCallback, {frameDown:'blank-button-clicked', text:'Main Menu'})
		mainMenuButton.setScale(2/3, 1/2)
	}
}
