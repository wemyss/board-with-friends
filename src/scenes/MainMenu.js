
export default class MainMenu extends Phaser.Scene {
	
	constructor() {
		super({ key: 'MainMenu' })
	}
	
	preload() {
	}
	
	create() {
		// background
		this.add.image(400, 300, 'mountain')
		
		this.add.text(150, 100, 'Main Menu', {font: '80px Courier', fill: '#540F0F'})
		// Play button
		this.playButton = this.add.text(350, 250, 'Play', {font: '36px Courier', fill: '#466E85'})
		this.playButton.setInteractive()
		this.playButton.on('pointerdown', () => {
			this.scene.switch('InGameMenu')
		})
			
		this.optionButton = this.add.text(350, 350, 'Options', {font: '36px Courier', fill: '#466E85'})
	}
	
	update() {
	}
}
