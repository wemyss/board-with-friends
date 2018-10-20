export default class LocationBar {
	constructor(scene, color) {
		this.scene = scene
		this.color = color 
	}

	create() {
		this.progressBar = this.scene.add.graphics()
		this.progressBar.setScrollFactor(0)
		this.progressBar.setDefaultStyles({
			fillStyle: {
				color: this.color,
				alpha: 0.5
			}
		})
	}
	
	update(location) {
		this.progressBar.clear()
		this.progressBar.fillRect(530, 30, 2 * location, 12)
		
	}
}
