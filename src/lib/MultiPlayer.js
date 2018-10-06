import { Vec2 } from 'planck-js'

import Player from './Player'


const EMIT_FREQUENCY = 5


/*
 * Multiplayer class to add multiplayer support to the client using sockets.
 * Extends the base player class so that it's easy to swap around sharing the same interface.
 */
export default class MultiPlayer extends Player {
	/*
	 * @param {Player} me - player object for this player - "player one"
	 * @param {String} gameId - the id of the game to connect to
	 * @param {Object} opponents
	 */
	constructor(scene, gameId, opponents, socket) {
		super(scene)

		this.gameId = gameId
		this.socket = socket

		this.opponents = {}
		for (const id of opponents) {
			this.opponents[id] = new Player(scene)
		}

		this.emitFreq = 0
	}

	// @override
	create() {
		super.create()

		for (const id in this.opponents) {
			this.opponents[id].create()
			this.opponents[id].obj.setAlpha(0.5)
		}

		this.registerForUpdates()
	}

	// @override
	update() {
		super.update()


		if (++this.emitFreq > EMIT_FREQUENCY) {
			this.emitPlayerData()
			this.emitFreq = 0
		}

		for (const id in this.opponents) {
			this.opponents[id].update()
		}

	}


	// @override
	checkActions(c) {
		if (super.checkActions(c)) {
			// this.emitPlayerData()
		}
	}


	/*
	 * Emit my player data to the game server
	 */
	emitPlayerData() {
		const b = this.body

		this.socket.emit('move-player', {
			gameId: this.gameId,
			data: {
				pos: b.getPosition(),
				angle: b.getAngle(),
				lv: b.getLinearVelocity(),
				av: b.getAngularVelocity(),
			},
		})
	}

	/*
	 * Receive updates from the server on all the other players in the game
	 */
	registerForUpdates() {
		this.socket.on('update-players', playersData => {
			for (const id in playersData) {
				// skip myself
				if (id === this.socket.id) continue


				// TODO: remove player if someone disconnects
				const body = this.opponents[id].body
				const {pos, angle, lv, av } = playersData[id]

				body.setPosition(pos)
				body.setAngle(angle)
				body.setLinearVelocity(lv)
				body.setAngularVelocity(av)
			}
		})
	}


	/*
	 *
	 */
	shutdown() {
		this.socket.emit('leave-game', this.gameId)
		this.socket.disconnect()
	}

}
