import { HEADINGS, TEXT, GAME_HCENTER } from '../lib/constants'
import { addButton } from '../lib/utils'
import { getStats } from '../lib/stats'
import * as music from '../lib/Music'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	create() {
		const { falls, flips, hits, score } = getStats()
		const style = { font: '34px Courier', fill: TEXT }


		this.add.text(GAME_HCENTER, 100, 'Gameover', { font: '80px Courier', fill: HEADINGS }).setOrigin(0.5)
		this.add.text(GAME_HCENTER-140, 200, 'Your score: ' + score, style)
		this.add.text(GAME_HCENTER-160, 250, 'Objects hit: ' + hits, style)
		this.add.text(GAME_HCENTER-220, 300, 'Crash landings: ' + falls, style)
		this.add.text(GAME_HCENTER-240, 350, 'Number of flips: ' + flips, style)

		const mainMenuCallback = () => {
			music.stopGameMusic()
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			this.scene.start('MainMenu')
		}

		const mainMenuButton = addButton(this, GAME_HCENTER, 460, 'button', 'blank-button', mainMenuCallback,
			{frameDown:'blank-button-clicked', text:'Main Menu'}
		)
		mainMenuButton.setScale(2/3, 1/2)
	}
}
