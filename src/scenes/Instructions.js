import { HEADINGS, TEXT } from '../lib/constants'
import { addButton } from '../lib/utils'
import { GAME_HCENTER, GAME_VCENTER, GAME_WIDTH, GAME_HEIGHT} from '../lib/constants'

export default class Instructions extends Phaser.Scene {
	constructor() {
		super({ key: 'Instructions' })
	}

	create() {
		const style = {font: '34px Courier', fill: TEXT}

      // height and width of the instructions picture
      const aspect_ratio = 1296/1960
      const width = Math.min(GAME_WIDTH, 1960)
      this.add.image(GAME_HCENTER, GAME_VCENTER, 'instructions').setDisplaySize(width, width * aspect_ratio)

		const mainMenuCallback = () => {
			this.scene.stop('Instructions')
			this.scene.start('MainMenu')
		}

		const backButton = addButton(this, 150, 60, 'button', 'blank-button', mainMenuCallback, {frameDown:'blank-button-clicked', text:'Back'})
		backButton.setScale(2/3, 1/2)
	}
}
