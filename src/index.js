<<<<<<< HEAD
// use for offline development
// import 'phaser'

import Example from './scenes/Example'
import MainMenu from './scenes/MainMenu'
import Preloader from './scenes/Preloader'
=======
import 'phaser'

import Boot from './scenes/Boot'
import MainGame from './scenes/MainGame'

>>>>>>> ec9942f7b63d08bbb26fff67d5b8e92bec832fe4
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	backgroundColor: 0xdffdf0,
	scene: [
<<<<<<< HEAD
		Preloader, MainMenu, Example
=======
		Boot,
		MainGame,
>>>>>>> ec9942f7b63d08bbb26fff67d5b8e92bec832fe4
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
