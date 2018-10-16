import Player from './Player'
import { HZ_MS } from './constants'

const EMIT_FREQUENCY = 5

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

		// Do some hack physics syncing to make it a bit smoother for multiplayer
		// -----------------------

		// make everyone sleep
		this.body.m_awakeFlag = false
		for (const id in this.opponents) {
			this.opponents[id].body.m_awakeFlag = false
		}

		const now = new Date().getTime()

		for (const id in this.opponents) {
			const body = this.opponents[id].body

			// skip if opponent does not have new physics sync data
			if (!this.opponents[id].latestPhysics) continue

			const { pos, angle, lv, av, time } = this.opponents[id].latestPhysics

			// wake this player up
			body.m_awakeFlag = true

			// update their physics to where the last
			body.setPosition(pos)
			body.setAngle(angle)
			body.setLinearVelocity(lv)
			body.setAngularVelocity(av)

			// empty the physics data
			this.opponents[id].latestPhysics = null

			for (let delta = now - time; delta > HZ_MS; delta -= HZ_MS) {
				world.step(1/60)
			}

			body.m_awakeFlag = false
		}


		// wake everyone up
		this.body.m_awakeFlag = true
		for (const id in this.opponents) {
			this.opponents[id].body.m_awakeFlag = true
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

				// TODO: remove player if someone disconnects
				this.opponents[id].latestPhysics = playersData[id]
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
