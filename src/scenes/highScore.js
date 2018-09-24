import _mountain from '../assets/images/mountain.png'

export default class highScore extends Phaser.Scene {
	constructor() {
		super({ key: 'highScore' })
	}

	preload() {
		this.load.image('mountain', _mountain)
		this.load.json('scoreSheet', '../assets/score.json')
	}

	create() {
		//background
		this.add.image(400, 300, 'mountain')

		this.add.text(115, 80, 'Highest Scores', {font: '70px Courier', fill: '#540F0F'})

		//this.cache.json.get('scoreSheet'))
		//Still figuring out how to use json files here
		this.test = this.add.text(120, 180, 'score: ', {font: '36px Courier', fill: '#466E85'})
		this.test.setText('  1      Sam       9030')
		this.test = this.add.text(120, 230, 'score: ', {font: '36px Courier', fill: '#466E85'})
		this.test.setText('  2      Kayla     8890')
		this.test = this.add.text(120, 280, 'score: ', {font: '36px Courier', fill: '#466E85'})
		this.test.setText('  3      Kirsten   6580')
		this.test = this.add.text(120, 330, 'score: ', {font: '36px Courier', fill: '#466E85'})
		this.test.setText('  4      Keung     4520')
		this.test = this.add.text(120, 380, 'score: ', {font: '36px Courier', fill: '#466E85'})
		this.test.setText('  5      Alex      2500')

		this.mainMenu = this.add.text(325, 450, 'Main Menu', {font: '36px Courier', fill: '#540F0F'})
	}
}
