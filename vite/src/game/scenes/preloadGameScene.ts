import { SPRITES } from "../constants/assetConstants";

export default class PreloadGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadGameScene' })
    }

    preload(): void {
        this.load.image(SPRITES.CELL.KEY, SPRITES.CELL.PATH);
        this.load.image(SPRITES.CELL.HIT.KEY, SPRITES.CELL.HIT.PATH);
        this.load.image(SPRITES.CELL.MISS.KEY, SPRITES.CELL.MISS.PATH);
    }

    create() {
        this.scene.start('GameScene')
    }
}
