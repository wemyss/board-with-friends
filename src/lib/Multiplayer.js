import { Vec2 } from 'planck-js'
import Player from './Player'
import { HZ_MS } from './constants'

const EMIT_FREQUENCY = 3

/*
 * Multiplayer class to add multiplayer support to the client using sockets.
 * Extends the base player class so that it's easy to swap around sharing the same interface.
 */
export default class Multiplayer extends Player {
	/*
	 * @param {Player} me - player object for this player - "player one"
	 * @param {String} gameId - the id of the game to connect to
	 * @param {Array<String>} opponents - ids of all opponents in the game
	 * @param {Object} socket - socket.io object
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
		for (const id in this.opponents) {
			this.opponents[id].create('opponent')
			this.opponents[id].obj.setAlpha(0.7)
		}

		// render me after my opponents so that I am on top`
		super.create()

		this.registerForUpdates()
	}

	// @override
	update(world) {
		super.update()

		if (++this.emitFreq > EMIT_FREQUENCY) {
			this.emitPlayerData()
			this.emitFreq = 0
		}

		// update opponents player objects
		for (const id in this.opponents) {
			this.opponents[id].update()
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
				time: new Date().getTime(),

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

				const body = this.opponents[id].body
				const { pos, angle, lv, av, time } = playersData[id]

				// Make things buttery smooth and in sync with difference vector
				const posDelta = new Vec2(pos).sub(body.getPosition())

				body.setLinearVelocity(new Vec2(lv).add(posDelta))
				body.setAngle(angle)
				body.setAngularVelocity(av)
				// body.setPosition(pos)
			}
		})
	}


	/*
	 * Cleanup the socket manually when I quit the game
	 */
	shutdown() {
		this.socket.emit('leave-game', this.gameId)
		this.socket.disconnect()
	}
}
