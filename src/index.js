import 'phaser'

import Boot from './scenes/Boot'
import MainGame from './scenes/MainGame'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	backgroundColor: 0xdffdf0,
	scene: [
		Boot,
		MainGame,
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
