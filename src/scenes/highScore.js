import _mountain from '../assets/images/mountain.png'
import _score from '../assets/score.json'

export default class highScore extends Phaser.Scene {
	constructor() {
		super({ key: 'highScore' })
	}

	preload() {
		this.load.image('mountain', _mountain)
		this.load.json ('scoreSheet', _score)
	}

	create() {
		var scoreList = []
		var num = 0
		this.count = 1
		this.x = 120
		this.y = 180
		//background
		this.add.image(400, 300, 'mountain')
		this.scores = this.cache.json.get('scoreSheet')

		this.add.text(115, 80, 'Highest Scores', {font: '70px Courier', fill: '#540F0F'})

		this.scores.Players.forEach(function(element) {//Gets all the scores
			scoreList.push(element.Score)
		})
		scoreList.sort()
		scoreList.reverse()

		while (this.count <= 5) { //Displays the top 5 highest players
			var name = ''
			var score = ''

			this.scores.Players.forEach(function(element) {
				if (scoreList[num] == element.Score) {
					name = element.Name
					score = element.Score
				}
			})

			this.test = this.add.text(this.x, this.y, 'score: ', {font: '36px Courier', fill: '#466E85'})
			this.test.setText('  '+ this.count + '     ' + name + '     ' + score)
			this.count++
			num++
			this.y += 50
		}

		this.mainMenu = this.add.text(325, 450, 'Main Menu', {font: '36px Courier', fill: '#540F0F'})
	}
}
