import _background from '../assets/images/sky.png'

export default class EndGame extends Phaser.Scene {
	constructor() {
		super({ key: 'EndGame' })
	}

	init(data) {
		this.score = data.score
		this.hits = data.hits
	}

	preload() {
		this.load.image('background', _background)
	}

	create() {
		this.add.text(200, 100, 'Gameover', {font: '80px Courier', fill: '#540F0F'})
		this.add.image(400, 400, 'background').setAlpha(0.2)

		this.score_Display = this.add.text(240, 200, 'Your Score:', {font: '36px Courier', fill: '#466E85'})
		this.score_Display.setText('Your Score: ' + this.score)

		this.hit_Display = this.add.text(220, 250, 'Objects Hit:', {font: '36px Courier', fill: '#466E85'})
		this.hit_Display.setText('Objects Hit: ' + this.hits)

		this.mainMenu = this.add.text(150, 400, 'Main Menu', {font: '36px Courier', fill: '#540F0F'})
		this.mainMenu.setInteractive()
		this.mainMenu.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.start('MainMenu')
		})

		//Swaps to highScore scene
		this.highScore = this.add.text(450, 400, 'High Score', {font: '36px Courier', fill: '#540F0F'})
		this.highScore.setInteractive()
		this.highScore.on('pointerdown', () => {
			this.scene.start('HighScore')
		})
	}
}
