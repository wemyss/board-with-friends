const http = require('http')
const app = require('./config')
const httpServer = http.Server(app)
const io = require('socket.io')(httpServer)

const PORT = process.env.PORT || 8000

const games = {}
const players = {}


// Utils
// ----------------------------------------
function leaveGame(gameId, socket) {
	if (gameId in games && socket.id in games[gameId]) {
		delete games[gameId][socket.id]

		if (Object.keys(games[gameId]).length === 0) {
			delete games[gameId]
		}  else {
			syncLobby(gameId)
		}
	}

	delete players[socket.id]
	console.log('Player left game, game states remaining is...', games)
}

function syncLobby(gameId) {
	// [{ id, name }, { id, name }...]
	const data = Object.keys(games[gameId]).map(id => ({ id, name: players[id] }))

	io.to(gameId).emit('sync-lobby', data)
}



// Socket events / endpoints
// ----------------------------------------
io.on('connection', function(socket) {

	// When player 2 is joining player 1's game
	socket.on('join-game', function(data) {
		const { gameId, playerName } = data
		players[socket.id] = playerName

		socket.join(gameId)

		if (!(gameId in games)) {
			games[gameId] = {}
		}
		games[gameId][socket.id] = {}

		syncLobby(gameId)
	})

	// Leave the game
	socket.on('leave-game', gameId => leaveGame(gameId, socket))

	// When a player updates their position
	socket.on('move-player', function(state) {
		const { gameId, data } = state

		if (games[gameId] === undefined || games[gameId][socket.id] === undefined) {
			// No such game exists
			return
		}

		games[gameId][socket.id] = data

		const packet = Object.assign(games[gameId][socket.id], {id: socket.id})

		// Send the data to all the other players in this game
		socket.broadcast.to(gameId).emit('update-players', packet)
	})

	socket.on('start-game', function(gameId) {
		io.to(gameId).emit('start-game')
	})


	socket.on('disconnecting', reason => {
		console.log(reason)
		for (const gameId of Object.keys(socket.rooms)) {
			leaveGame(gameId, socket)
		}
	})
})

httpServer.listen(PORT, () => console.log('Game http server listening on:', PORT))
