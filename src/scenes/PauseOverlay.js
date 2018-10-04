// For in game menu layer that gets fixed to background

export default class PauseOverlay extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseOverlay' })
	}

	preload() {
	}

	create() {
		// Rectangle
		var rect = new Phaser.Geom.Rectangle(300, 220, 250, 100)
		var graphics = this.add.graphics({ fillStyle: { color: 0x8FB2C4 } })
		graphics.fillRectShape(rect)
		
		this.finishText = this.add.text(350, 150, 'Finish!', {font: '36px Courier', fill: '#D91B1E'})
		// Restart
		this.restartButton = this.add.text(350, 250, 'Restart', {font: '36px Courier', fill: '#ECEFED'})
		this.restartButton.setInteractive()
		this.restartButton.on('pointerdown', () => {
			this.scene.stop('MainGame')
			this.scene.stop('InGameMenu')
			this.scene.start('MainGame')
		})
	}
}
