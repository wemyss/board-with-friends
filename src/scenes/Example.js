// Import image files
import _mountain from "../assets/images/mountain.png";
import _platform from "../assets/images/platform.png";
import _dude from "../assets/sprites/dude.png";

var canJump = true;

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

		// platform/ground
		this.matter.add
			.image(400, 480, "ground", null, { isStatic: true })
			.setAngle(0);

		// player
		this.player = this.matter.add.sprite(400, 400, "dude");
		this.player.setBounce(0.2);

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

		this.matter.world.setBounds().update30Hz();

		// add collision handling for jumping
		this.matter.world.on("collisionstart", this.handleCollision);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	handleCollision(event, bodyA, bodyB) {
		// console.log("Collision!");

		// bodyB is the sprite when colliding with the ground
		// when the sprite collides with the ground not the boundaries allow them to jump again
		if (bodyB.gameObject) {
			canJump = true;
		}
	}

	update() {
		// todo: update these to rotate the sprite so you can do flips
		if (this.cursors.left.isDown && !canJump) {
			// this.player.setVelocityX(-12);
			this.player.anims.play("left", true);
		} else if (this.cursors.right.isDown && !canJump) {
			// this.player.setVelocityX(12);
			this.player.anims.play("right", true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play("turn");
		}

		if (this.cursors.up.isDown && canJump) {
			this.player.setVelocityY(-40);
			canJump = false;
		}
	}
}
