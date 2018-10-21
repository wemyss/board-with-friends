import { addButton } from '../lib/utils'
import { GAME_HCENTER } from '../lib/constants'
import * as music from '../lib/Music'


export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' })
	}

	create() {
		music.resumeMenuMusic()
		this.add.image(GAME_HCENTER, 140, 'title').setScale(1/2)

		const singlePlayerBtn = addButton(
			this, GAME_HCENTER, 270, 'button', 'blank-button',
			() => this.scene.start('MainGame', { isMultiplayer: false }),
			{ frameDown: 'blank-button-clicked', text: 'Single Player' }
		)
		singlePlayerBtn.setScale(2/3, 1/2)


		const multiplayerBtn = addButton(
			this, GAME_HCENTER, 380, 'button', 'blank-button',
			() => this.scene.start('MultiplayerMenu'),
			{ frameDown: 'blank-button-clicked', text: 'Multiplayer' }
		)
		multiplayerBtn.setScale(2/3, 1/2)

		const instructionsBtn = addButton(
			this, GAME_HCENTER, 490, 'button', 'blank-button',
			() => this.scene.start('Instructions'),
			{ frameDown: 'blank-button-clicked', text: 'Instructions' }
		)
		instructionsBtn.setScale(2/3, 1/2)
	}
}
