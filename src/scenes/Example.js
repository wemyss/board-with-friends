// Import image files
import _mountain from '../assets/images/mountain.png'
import _platform from '../assets/images/platform.png'
import _dude from '../assets/sprites/dude.png'


export default class Example extends Phaser.Scene {

	constructor() {
		// Name of my scene
		super({ key: 'Example' })
	}

	preload() {
		this.load.image('mountain', _mountain)
		this.load.image('ground', _platform)
		this.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 })
	}

	create() {
		// background
		this.add.image(400, 300, 'mountain')

		// platform
		this.matter.add.image(400, 480, 'ground', null, { isStatic: true }).setAngle(13)

		// player
		this.player = this.matter.add.sprite(400, 400, 'dude')
		this.player.setBounce(1)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

		this.matter.world.setBounds().update30Hz()
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-1)
			this.player.anims.play('left', true)

		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(1)
			this.player.anims.play('right', true)

		} else {
			this.player.setVelocityX(0)
			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown) {
			this.player.setVelocityY(-6)
		}
	}
}
