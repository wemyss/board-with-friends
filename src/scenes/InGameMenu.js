// For in game menu layer that gets fixed to background

export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	preload() {
	}

	create() {
		// Quit button that stick to camera
		this.quitButton = this.add.text(30, 20, 'Quit', {font: '36px Courier', fill: '#466E85'})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.start('MainMenu')
		})
	}
}
