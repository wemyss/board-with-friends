import 'phaser'

import Boot from './scenes/Boot'
import EndGame from './scenes/EndGame'
import HighScore from './scenes/HighScore'
import InGameMenu from './scenes/InGameMenu'
import MainGame from './scenes/MainGame'
import MainMenu from './scenes/MainMenu'
import MultiplayerMenu from './scenes/MultiplayerMenu'

import { GAME_WIDTH, GAME_HEIGHT } from './lib/constants'

const config = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	pixelArt: true,
	backgroundColor: 0xdffdf0,
	scene: [
		Boot,
		MainMenu,
		MultiplayerMenu,
		MainGame,
		InGameMenu,
		EndGame,
		HighScore,
	],
}

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config)


// hot reloading - see if this works for games
if (module.hot) {
	module.hot.accept(() => {})

	module.hot.dispose(() => {
		window.location.reload()
	})
}
