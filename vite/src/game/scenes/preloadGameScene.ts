import { SPRITES } from "../constants/assetConstants";

export default class PreloadGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadGameScene' })
    }

    preload(): void {
        this.load.image(SPRITES.CELL.KEY, SPRITES.CELL.PATH);
        this.load.image(SPRITES.CELL.HOVER.KEY, SPRITES.CELL.HOVER.PATH);
    }

    create() {
        this.scene.start('GameScene')
    }
}
