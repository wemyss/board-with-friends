var inGameMusic
var mainMenuMusic

export function addMusic(menuMusic, gameMusic) {
	mainMenuMusic = menuMusic
	inGameMusic = gameMusic
}

export function startGameMusic() {
	inGameMusic.play()
}

export function startMenuMusic() {
	mainMenuMusic.play()
}

export function stopGameMusic() {
	inGameMusic.stop()
}

export function pauseMenuMusic() {
	mainMenuMusic.pause()
}

export function resumeMenuMusic() {
	mainMenuMusic.resume()
}
