

export default class MainMenu extends Phaser.Scene {
  
  constructor() {
    super({ key: 'MainMenu'});
  }
  
  preload() {
    
  }
  
  create() {
    // background
    this.add.image(400, 300, 'mountain');
    this.add.text(150, 100, 'Main Menu', {font: '80px Courier', fill: '#000000'});
    // play button
    this.playButton = this.add.text(350, 250, 'Play', {font: '36px Courier', fill: '#37474F'});
    this.playButton.setInteractive();
    this.playButton.on('pointerdown', () => {
        this.scene.start('Example');
        // this.scene.start('Example');
      });
    
    this.optionButton = this.add.text(350, 350, 'Options', {font: '36px Courier', fill: '#37474F'});
  }
  
  update() {
  }
}
