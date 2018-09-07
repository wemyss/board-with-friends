import 'phaser'

import _sky from '../assets/images/sky.png'
import _platform from '../assets/images/platform.png'
import _dude from '../assets/sprites/dude.png'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
  default: 'arcade',
    arcade: {
      gravity: { y: 980 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

const game = new Phaser.Game(config)
var cursors, platforms, player


// Special Phaser Scene functions
function preload() {
  this.load.image('sky', _sky)
  this.load.image('ground', _platform)
  this.load.spritesheet('dude', _dude, { frameWidth: 32, frameHeight: 48 })
}

function create() {
  // background
  this.add.image(400, 300, 'sky')

  // platforms
  platforms = this.physics.add.staticGroup()

  platforms.create(400, 568, 'ground').setScale(2).refreshBody()
  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')

  // player
  player = this.physics.add.sprite(100, 450, 'dude')

  player.setBounce(0.2)
  player.setCollideWorldBounds(true)

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


  this.physics.add.collider(player, platforms)
  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  if (cursors.left.isDown) {
      player.setVelocityX(-160)
      player.anims.play('left', true)

  } else if (cursors.right.isDown) {
      player.setVelocityX(160)
      player.anims.play('right', true)

  } else {
      player.setVelocityX(0)
      player.anims.play('turn')
  }

  if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-620)
  }
}





// hot reloading - see if this works for games
if (module.hot) {
  module.hot.accept(() => {})

  module.hot.dispose(() => {
    window.location.reload()
  })
}
