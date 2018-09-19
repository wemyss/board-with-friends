// use for offline development
import 'phaser'

import MainGame from './scenes/MainGame'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	backgroundColor: 0xdffdf0,
	scene: [
		MainGame,
	],
}

const game = new Phaser.Game(config)


// hot reloading - see if this works for games
if (module.hot) {
	module.hot.accept(() => {})

	module.hot.dispose(() => {
		window.location.reload()
	})
}
