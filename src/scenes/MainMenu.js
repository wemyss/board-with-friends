
export default class MainMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MainMenu', active: true })
	}

	preload() {
	}

	create() {
		this.add.text(100, 100, 'Board With Friends', {font: '60px Courier', fill: '#540F0F'})
		// Play button
		this.playButton = this.add.text(350, 250, 'Play', {font: '36px Courier', fill: '#466E85'})
		this.playButton.setInteractive()
		this.playButton.on('pointerdown', () => {
			this.scene.start('MainGame')
		})

		this.optionButton = this.add.text(350, 350, 'Options', {font: '36px Courier', fill: '#466E85'})
	}

	update() {
	}
}
