import { addButton } from '../lib/utils'
import { GAME_HCENTER } from '../lib/constants'
import * as music from '../lib/Music'

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
		music.resumeMenuMusic()
		this.add.image(GAME_HCENTER, 140, 'title').setScale(1/2)

		const singlePlayerBtn = addButton(
			this, GAME_HCENTER, 300, 'button', 'blank-button',
			() => this.scene.start('MainGame'),
			{ frameDown: 'blank-button-clicked', text: 'Single Player' }
		)
		singlePlayerBtn.setScale(2/3, 1/2)


		const multiplayerBtn = addButton(
			this, GAME_HCENTER, 420, 'button', 'blank-button',
			() => this.scene.start('MultiplayerMenu'),
			{ frameDown: 'blank-button-clicked', text: 'Multiplayer' }
		)
		multiplayerBtn.setScale(2/3, 1/2)
	}

	update() {
	}
}
