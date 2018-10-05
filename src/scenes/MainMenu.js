import { BUTTON_TEXTSTYLE } from '../lib/constants'
import { addButton } from '../lib/utils'

import _title from '../assets/images/title.png'
import _button from '../assets/sprites/button-atlas.png'
import _button_json from '../assets/sprites/button-atlas.json'

export default class MainMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MainMenu', active: true })
	}

	preload() {
		this.load.image('title', _title)
		this.load.atlas('button', _button, _button_json)
	}

	create() {
		const CENTER = 0.5

		this.add.image(400, 140, 'title').setOrigin(CENTER).setScale(1/2)

		const singlePlayerButton = addButton(this, 400, 300, 'button', 'blank-button', 'blank-button-clicked')
		singlePlayerButton.setScale(2/3, 1/2)
		singlePlayerButton.on('pointerup', () => {
			this.scene.start('MainGame')
		})
		this.add.text(400, 295, 'Single Player', BUTTON_TEXTSTYLE).setOrigin(CENTER)

		const multiplayerButton = addButton(this, 400, 420, 'button', 'blank-button', 'blank-button-clicked')
		multiplayerButton.setScale(2/3, 1/2)
		this.add.text(400, 415, 'Multiplayer', BUTTON_TEXTSTYLE).setOrigin(CENTER)
	}

	update() {
	}
}
