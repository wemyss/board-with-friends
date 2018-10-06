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
		this.add.image(400, 140, 'title').setScale(1/2)

		const singlePlayerCallback = () => {
			this.scene.start('MainGame')
		}

		const singlePlayerButton = addButton(this, 400, 300, 'button', 'blank-button', singlePlayerCallback, {frameDown:'blank-button-clicked', text:'Single Player'})
		singlePlayerButton.setScale(2/3, 1/2)

		const multiplayerCallback = () => {}

		const multiplayerButton = addButton(this, 400, 420, 'button', 'blank-button', multiplayerCallback, {frameDown:'blank-button-clicked', text:'Multiplayer'})
		multiplayerButton.setScale(2/3, 1/2)
	}

	update() {
	}
}
