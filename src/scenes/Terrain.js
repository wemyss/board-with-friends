import _dude from '../assets/sprites/dude.png'
export default class Terrain extends Phaser.Scene {
	constructor() {
		super({ key: 'Terrain' })
	}

	preload() {
		this.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 })
	}

	create() {
		console.log('create()')
		this.bezierGraphics = this.add.graphics()
		this.hill = new Phaser.Curves.Path()

		this.hill.add(new Phaser.Curves.CubicBezier([100,100, 200,522, 350,12,  700,500]))
		// this.hill.lineTo(750,550)
		this.hill.lineTo(100,500)
		// this.hill.lineTo(100,100)
		this.bezierGraphics.clear()
		this.bezierGraphics.lineStyle(10, 0xffffff);
		this.hill.draw(this.bezierGraphics)

		let pnt = this.hill.getBounds()
		let vertices = this.hill.getSpacedPoints(100)
		console.log(pnt)
		this.matter.add.fromVertices(178, pnt.centerY, vertices, { isStatic: true })

		// player
		this.player = this.matter.add.sprite(400, 100, 'dude')
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
