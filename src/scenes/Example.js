
export default class Example extends Phaser.Scene {

	constructor() {
		// Name of my scene
		super({ key: 'Example' })
	}

	preload() {
		// this.load.image('mountain', _mountain)
		// this.load.image('ground', _platform)
		// this.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 })
	}

	create() {
		// background
		this.add.image(400, 300, 'mountain')

		// restart button
		this.restartButton = this.add.text(100, 50, 'Restart', {font: '28px Courier', fill: '#37474F'});
		this.restartButton.setInteractive();
		this.restartButton.on('pointerdown', () => {
			this.registry.destroy();
			this.events.off();
			this.scene.restart();
		});
			
		// quit button
    this.quitButton = this.add.text(100, 100, 'Quit', {font: '28px Courier', fill: '#37474F'});
    this.quitButton.setInteractive();
    this.quitButton.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
		
		// platform
		this.matter.add.image(400, 480, 'ground', null, { isStatic: true }).setAngle(13)

		// player
		this.player = this.matter.add.sprite(400, 400, 'dude')
		this.player.setBounce(1)

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
