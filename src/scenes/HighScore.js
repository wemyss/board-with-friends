import _score from '../assets/score.json'

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

		this.add.text(115, 80, 'Highest Scores', {font: '70px Courier', fill: '#540F0F'})
		this.scores = this.cache.json.get('scoreSheet')
		const highscores = this.scores.Players// Sort scores in decending order
		highscores.sort((a, b) => b.Score - a.Score)

		// render it
		for (const entry of highscores) {
			name = entry.Name
			score = entry.Score
			this.text = this.add.text(x, y, 'score: ', {font: '36px Courier', fill: '#466E85'})
			this.text.setText('  '+ rank + '     ' + name + '     ' + score)
			rank++
			y += 50
		}

		this.mainMenu = this.add.text(325, 450, 'Main Menu', {font: '36px Courier', fill: '#540F0F'})
		this.mainMenu.setInteractive()
		this.mainMenu.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.start('MainMenu')
		})
	}
}
