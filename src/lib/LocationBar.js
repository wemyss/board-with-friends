import { TEXT, OFF_WHITE, BLUE } from '../lib/constants'

export default class LocationBar {
	constructor(scene, id) {
		this.scene = scene
		this.id = id
	}

	create() {
		// Other player
		this.playerText = this.scene.add.text(430, 28*this.id, 'Player ' + this.id + ': ', { font: '16px Courier', fill: TEXT })
		// Current player
		if (this.id == 1) {
			this.playerText = this.playerText.setText('You: ')
		}
		this.playerText.setScrollFactor(0)
		this.progressBox = this.scene.add.graphics()
		this.progressBox.fillStyle(BLUE, 0.5)
		this.progressBox.fillRect(530, 30*this.id, 200, 12)
		this.progressBox.setScrollFactor(0)
		this.progressBar = this.scene.add.graphics()
		this.progressBar.setScrollFactor(0)
		this.progressText = this.scene.add.text(750, 30*this.id, '0' + '%', { font: '16px Courier', fill: TEXT })
		this.progressText.setScrollFactor(0)
		
	}
	
	update(location) {
		this.progressBar.fillStyle(OFF_WHITE, 1)
		this.progressBar.fillRect(530, 30*this.id, 2 * location, 12)
		this.progressText.setText(location + '%')
	}
}
