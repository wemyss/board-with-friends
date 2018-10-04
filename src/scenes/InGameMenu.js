// For in game menu layer that gets fixed to background

export default class InGameMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'InGameMenu' })
	}

	preload() {
	}

	create() {
		// Quit button that stick to camera
		this.quitButton = this.add.text(30, 20, 'Quit', {font: '36px Courier', fill: '#9b1417'})
		this.quitButton.setInteractive()
		this.quitButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.stop('PauseOverlay')
			this.scene.start('MainMenu')
		})
		
		// Pause button
		this.pauseButton = this.add.text(650, 20, 'Pause', {font: '36px Courier', fill: '#6E8C52'})
		this.pauseButton.setInteractive()
		
		// Resume button
		this.resumeButton = this.add.text(650, 20, 'Resume', {font: '36px Courier', fill: '#6E8C52'})
		this.resumeButton.setInteractive()
		this.resumeButton.visible = false
		
		this.pauseButton.on('pointerdown', () => {
			this.scene.pause('MainGame')
			this.pauseButton.visible = false
			this.resumeButton.visible = true
		})
		
		this.resumeButton.on('pointerdown', () => {
			this.scene.resume('MainGame')
			this.resumeButton.visible = false
			this.pauseButton.visible = true
		})
		
	}
}
