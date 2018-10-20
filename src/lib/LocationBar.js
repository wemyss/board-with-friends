export default class LocationBar {
	constructor(scene) {
		this.scene = scene
	}

	create() {
		this.progressBar = this.scene.add.graphics()
		this.progressBar.setScrollFactor(0)
	}
	
	update(location, color) {
		this.progressBar.fillRect(530, 30, 2 * location, 12)
		this.progressBar.fillStyle(color, 0.5)
	}
}
