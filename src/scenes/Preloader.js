import _mountain from '../assets/images/mountain.png'
import _title from '../assets/images/title.gif'
import _button from '../assets/images/button.png'
import _platform from '../assets/images/platform.png'
import _dude from '../assets/sprites/dude.png'

// Load all assets so animations don't die
export default class Preloader extends Phaser.Scene {
  
  constructor() {
    super({ key: 'Preloader', active: true});
  }

  preload() {
    // load main menu items
    this.load.image('mountain', _mountain);
		this.load.image('title', _title);
		this.load.image('button', _button);
    
    // load game items
    this.load.image('ground', _platform);
		this.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 });
    
  }
  
  create() {
    // Create animations once only
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
    
    // Start Main Menu
    this.scene.start('MainMenu');
  }
}