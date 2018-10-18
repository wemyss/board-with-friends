import _boarder from '../assets/sprites/boarder.png'
import _opponent from '../assets/sprites/boarder-blue.png'
import _tumble from '../assets/sprites/tumble.png'
import _mountain from '../assets/images/mountain.png'
import _ramp from '../assets/images/ramp.png'
import _rock1 from '../assets/images/rock1.png'
import _rock2 from '../assets/images/rock2.png'
import _inGameMusic from '../assets/audio/A Better World.mp3'

import { GAME_HCENTER, GAME_VCENTER, PLAYER_HEIGHT, PLAYER_WIDTH } from '../lib/constants'

export default class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'Boot', active: true })
	}

	preload() {
		this.load.spritesheet('boarder', _boarder, {frameWidth: PLAYER_WIDTH, frameHeight: PLAYER_HEIGHT})
		this.load.spritesheet('opponent', _opponent, {frameWidth: PLAYER_WIDTH, frameHeight: PLAYER_HEIGHT})
		this.load.spritesheet('tumble', _tumble, {frameWidth: 56, frameHeight: 48})
		this.load.image('mountain', _mountain)
		this.load.image('ramp', _ramp)

		this.load.image('rock1', _rock1)
		this.load.image('rock2', _rock2)
		
		this.load.audio('inGameMusic', _inGameMusic)
	}

	create() {
		this.add.image(GAME_HCENTER, GAME_VCENTER, 'mountain')
		
		this.soundtrack = this.sound.add('inGameMusic')
		this.soundtrack.play()

		// create animations
		this.anims.create({
			key: 'flicker',
			frames: this.anims.generateFrameNumbers('boarder', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: 5,
			yoyo: true,
		})

		const TUMBLE_LENGTH = 4
		const TUMBLE_FLICKER_LENGTH = 3

		let tumble_frames = []
		for (let i = 0; i < TUMBLE_LENGTH; i++) {
			tumble_frames = tumble_frames.concat(this.anims.generateFrameNumbers('tumble', { start: 0, end: 3 }))
		}
		for (let i = 0; i < TUMBLE_FLICKER_LENGTH; i++) {
			tumble_frames = tumble_frames.concat([{key: 'boarder', frame:1}, {key: 'boarder', frame:0}])
		}
		this.anims.create({
			key: 'tumble',
			frames: tumble_frames,
			frameRate: 15,
		})
	}
}
