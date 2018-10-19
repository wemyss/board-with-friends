import io from 'socket.io-client'

import { addButton } from '../lib/utils'
import { HEADINGS, GAME_HCENTER, TEXT } from '../lib/constants'

const CENTER = 0.5

export default class MultiplayerMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MultiplayerMenu' })
	}

	preload() {}

	create() {
		// Temporary UI until facebook

		let opponents = []
		const socket = io(process.env.SERVER_URL)
		socket.emit()
		const gameId = 'fix_me_when_we_do_facebook'

		const myName = process.env.ENABLE_FACEBOOK ? this.facebook.getPlayerName() : 'Mario'


		this.add.text(GAME_HCENTER, 140, 'Multiplayer', {font: '70px Courier', fill: HEADINGS})
			.setOrigin(CENTER)

		const playersText = this.add.text(GAME_HCENTER, 300, 'Players:', { font: '30px Courier', fill: TEXT })
			.setOrigin(CENTER)


		const backBtn = addButton(
			this, GAME_HCENTER - 125, 520, 'button', 'blank-button',
			() => {
				socket.disconnect()
				this.scene.start('MainMenu')
			},
			{ frameDown: 'blank-button-clicked', text: 'Back' })
		backBtn.setScale(1/2, 1/2)

		const createBtn = addButton(
			this, GAME_HCENTER + 125, 520, 'button', 'blank-button',
			() => {
				if (opponents.length) {
					socket.emit('start-game', gameId)
				}
			},
			{ frameDown: 'blank-button-clicked', text: 'Start Game!' }
		).setAlpha(.4)
		createBtn.setScale(2/3, 1/2)


		socket.on('sync-lobby', players => {
			// filter out myself from the list opponents
			opponents = players
				.filter(p => p.id !== socket.id)

			playersText.setText(`Players:\n${myName} (You)\n${opponents.map(o => o.name).join('\n')}`)

			if (opponents.length) {
				createBtn.setAlpha(1)
			} else {
				createBtn.setAlpha(.4)
			}
		})

		socket.on('start-game', () => {
			this.scene.start('MainGame', {
				isMultiplayer: true,
				gameId,
				opponents: opponents.map(o => o.id),
				socket,
			})
		})

		socket.emit('join-game', { gameId, playerName: myName })
	}
}
