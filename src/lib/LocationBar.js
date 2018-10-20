import { TEXT, OFF_WHITE } from '../lib/constants'

export default class LocationBar {
	constructor(scene, id) {
		this.scene = scene
		this.id = id
	}

	create() {
		// Other player
		// this.playerText = this.scene.add.text(430, 28*this.id, 'Player ' + this.id + ': ', { font: '16px Courier', fill: TEXT })
		// Current player
		// if (this.id == 1) {
		// 	this.playerText = this.playerText.setText('You: ')
		// }
		// this.playerText.setScrollFactor(0)
		// this.progressBox.setScrollFactor(0)
		this.progressBar = this.scene.add.graphics()
		this.progressBar.setScrollFactor(0)
		
		
	}
	
	update(location, color) {
		this.progressBar.fillStyle(color, 0.7)
		this.progressBar.fillRect(530, 30, 2 * location, 12)
	}
}
