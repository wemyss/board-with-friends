// use for offline development
// import 'phaser'

import Example from './scenes/Example'
import MainMenu from './scenes/MainMenu'
import Preloader from './scenes/Preloader'
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: 'matter',
		matter: {
			gravity: { y: 9 },
			debug: true,
		},
	},
	scene: [
		Preloader, MainMenu, Example
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
