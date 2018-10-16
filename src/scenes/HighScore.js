import _score from '../assets/score.json'
import { HEADINGS, TEXT } from '../lib/constants'
import { addButton } from '../lib/utils'

export default class HighScore extends Phaser.Scene {
	constructor() {
		super({ key: 'HighScore' })
	}

	preload() {
		this.load.json ('scoreSheet', _score)
	}

	create() {
		var name = ''
		var score = ''
		var rank = 1
		var x = 120
		var y = 180

		this.add.text(115, 80, 'Highest Scores', {font: '70px Courier', fill: HEADINGS})
		this.scores = this.cache.json.get('scoreSheet')
		const highscores = this.scores.Players// Sort scores in decending order
		highscores.sort((a, b) => b.Score - a.Score)

		// render it
		for (const entry of highscores) {
			name = entry.Name
			score = entry.Score
			this.text = this.add.text(x, y, 'score: ', {font: '36px Courier', fill: TEXT})
			this.text.setText('  '+ rank + '     ' + name + '     ' + score)
			rank++
			y += 50
		}

		const backCallback = () => {
			this.scene.start('MainMenu')
		}
		
		const backButton = addButton(this, 400, 540, 'button', 'blank-button', backCallback, {frameDown:'blank-button-clicked', text:'Back'})
		backButton.setScale(2/3, 1/2)

	}
}
