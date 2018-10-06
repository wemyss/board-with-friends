import io from 'socket.io-client'

import { INTERACTIVE_BUTTON, HEADINGS } from '../lib/constants'

const CENTER = 0.5
const menuButtonStyle = {font: '36px Courier', fill: INTERACTIVE_BUTTON}

export default class MultiPlayerMenu extends Phaser.Scene {

	constructor() {
		super({ key: 'MultiPlayerMenu' })
	}

	preload() {}

	create() {
		this.add.text(400, 100, 'Games', {font: '80px Courier', fill: HEADINGS}).setOrigin(CENTER)



		this.startBtn = this.add.text(400, 250, 'Create', menuButtonStyle).setOrigin(CENTER)
		this.startBtn.setInteractive()
		this.startBtn.on('pointerdown', () => {
			this.createGameScreen()
		})


		this.startBtn = this.add.text(400, 350, 'Join', menuButtonStyle).setOrigin(CENTER)
		this.startBtn.setInteractive()
		this.startBtn.on('pointerdown', () => {
			this.joinGameScreen()
		})

		/*
		 * MAYBE DO THIS
		 * 1. User taps on friends/multiplayer to see list of friends who play the game and invite them to start a game.
		 * 2. Waits for player 2 to accept the game and join the room
		 * 3. Starts the game physics and run
		 */


		let opponents = []
		const socket = io('http://localhost:8000')
		const gameId = 'test-game'

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


		this.startBtn = this.add.text(400, 350, 'Start', menuButtonStyle).setOrigin(CENTER)
		this.startBtn.setInteractive()
		this.startBtn.on('pointerdown', () => {
			socket.emit('start-game', gameId)
		})

	}

	update() {}
}

class JoinGameScreen extends Phaser.Scene {
	constructor() {
		super({ key: 'JoinGameScreen' })
	}

	create() {
		this.add.text(400, 100, 'Join', {font: '80px Courier', fill: HEADINGS}).setOrigin(CENTER)


		this.startBtn = this.add.text(400, 350, 'Start', menuButtonStyle).setOrigin(CENTER)
		this.startBtn.setInteractive()
		this.startBtn.on('pointerdown', () => {
			socket.emit('start-game', gameId)
		})
	}
}


class CreateGameScreen extends Phaser.Scene {
	constructor() {
		super({ key: 'CreateGameScreen' })
	}

	create() {
		this.add.text(400, 100, 'Create', {font: '80px Courier', fill: HEADINGS}).setOrigin(CENTER)


		this.startBtn = this.add.text(400, 350, 'Start', menuButtonStyle).setOrigin(CENTER)
		this.startBtn.setInteractive()
		this.startBtn.on('pointerdown', () => {
			socket.emit('start-game', gameId)
		})
	}
}
