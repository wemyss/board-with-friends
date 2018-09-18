// Import image files
import _mountain from "../assets/images/mountain.png";
import _platform from "../assets/images/platform.png";
import _dude from "../assets/sprites/dude.png";

export default class Example extends Phaser.Scene {
	constructor() {
		// Name of my scene
		super({ key: "Example" });
		
	}

	preload() {
		this.load.image("mountain", _mountain);
		this.load.image("ground", _platform);
		this.load.spritesheet("dude", _dude, {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	create() {
		// background
		this.add.image(400, 300, "mountain");

		// platform
		this._platform = this.physics.add.staticGroup();
		this._platform.create(400, 480, "ground");

		// this.matter = this.physics.add.staticGroup();
		// this.matter.add
		// 	.image(400, 480, "ground", null, { isStatic: true })
		// 	.setAngle(0);

		// player
		this.player = this.physics.add.sprite(400, 400, "dude");
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.player.body.setGravityY(300);

		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("dude", {
				start: 2,
				end: 5
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: "turn",
			frames: [{ key: "dude", frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("dude", {
				start: 2,
				end: 5
			}),
			frameRate: 10,
			repeat: -1
		});
		// adding the physics for the platforms
		this.physics.add.collider(this.player, this._platform);

		// this.matter.world.setBounds().update30Hz();
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		if (this.cursors.left.isDown && !this.player.body.touching.down) {
			// this.player.setVelocityX(-160);
			this.player.anims.play("left", true);
		} else if (this.cursors.right.isDown && !this.player.body.touching.down) {
			// this.player.setVelocityX(160);
			this.player.anims.play("right", true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play("turn");
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-300);
		}
	}
}
