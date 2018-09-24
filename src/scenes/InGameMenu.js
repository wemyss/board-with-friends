// For in game menu layer that gets fixed to background

export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	preload() {
		
	}

	create() {
		// Background
		this.add.image(400, 300, 'mountain')

		// Quit button that stick to camera
		this.quitButton = this.add.text(100, 50, 'Quit', {font: '36px Courier', fill: '#466E85'})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.moveBelow('InGameMenu', 'MainGame')
			this.scene.start('MainMenu')
		})

		// Show MainGame
		this.scene.moveAbove('InGameMenu', 'MainGame') 
		//this.scene.start('MainGame')
	}
}