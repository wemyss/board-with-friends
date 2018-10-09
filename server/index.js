const http = require('http')
const app = require('./config')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server)

Server.listen(PORT, () => console.log('Game server running on:', PORT))

let games = {}


// Utils
// ----------------------------------------
function leaveGame(gameId, socket) {
	if (gameId in games && socket.id in games[gameId]) {
		delete games[gameId][socket.id]

		if (Object.keys(games[gameId]).length === 0) {
			delete games[gameId]
		}  else {
			io.to(gameId).emit('sync-lobby', Object.keys(games[gameId]))
		}
	}
	console.log('Player left game, game states remaining is...', games)
}



// Socket events / endpoints
// ----------------------------------------
io.on('connection', function(socket) {

	// When player 2 is joining player 1's game
	socket.on('join-game', function(gameId) {
		socket.join(gameId)

		if (!(gameId in games)) {
			games[gameId] = {}
		}
		games[gameId][socket.id] = {}

		io.to(gameId).emit('sync-lobby', Object.keys(games[gameId]))
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


		// Send the data to all the other players in this game
		socket.broadcast.to(gameId).emit('update-players', games[gameId])
	})

	socket.on('start-game', function(gameId) {
		io.to(gameId).emit('start-game')
	})


	socket.on('disconnecting', reason => {
		console.log(reason)
		for (const gameId of Object.keys(socket.adapter.rooms)) {
			leaveGame(gameId, socket)
		}
	})
})
