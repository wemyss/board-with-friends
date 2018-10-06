import io from 'socket.io-client'

import { addButton } from '../lib/utils'
import { HEADINGS } from '../lib/constants'

const CENTER = 0.5

export default class MultiPlayerMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MultiPlayerMenu' })
	}

	preload() {}

	create() {
		// Temporary UI until facebook

		let opponents = []
		const socket = io('http://localhost:8000')
		const gameId = 'fix_me_when_we_do_facebook'


		this.add.text(400, 140, 'Multiplayer', {font: '70px Courier', fill: HEADINGS}).setOrigin(CENTER)


		const createBtn = addButton(
			this, 400, 300, 'button', 'blank-button',
			() => { socket.emit('start-game', gameId) },
			{ frameDown: 'blank-button-clicked', text: 'Start Game!' }
		)
		createBtn.setScale(2/3, 1/2)

		socket.on('sync-lobby', playerIds => {
			opponents = playerIds
			console.log(opponents.length + ' players in lobby')
		})
		socket.on('start-game', () => {
			this.scene.start('MainGame', {
				isMultiplayer: true,
				gameId,
				opponents: opponents.filter(id => id !== socket.id),
				socket
			})
		})

		socket.emit('join-game', gameId)
	}
}
