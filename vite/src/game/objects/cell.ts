import Phaser from 'phaser';
import { SPRITES } from "../constants/assetConstants";
import * as Api from "../../api/api"

export default class Cell extends Phaser.GameObjects.Image {
    private readonly size: number;
    private _gridIndex: number;
    private _isOpen: boolean;
    private _isInteractable: boolean;
    private readonly positionInGridX: number;
    private readonly positionInGridY: number;

    constructor(scene: Phaser.Scene, gridIndex: number, x: number, y: number, size: number, positionInGridX: number, positionInGridY: number) {
        super(scene, x, y, SPRITES.CELL.KEY);

        this.positionInGridX = positionInGridX;
        this.positionInGridY = positionInGridY;

        this._gridIndex = gridIndex;
        this.size = size;
        this.setOrigin(0.5, 0.5).setInteractive().setScale(this.size / this.width);
        this._isOpen = false;
        this._isInteractable = true;

        this.on('pointerover', this.scaleUp);
        this.on('pointerout', this.scaleDown);
        this.on('pointerdown', this.handlePointerDown);
    }

    get gridIndex(): number {
        return this._gridIndex;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    get isInteractable(): boolean {
        return this._isInteractable;
    }

    set isInteractable(value: boolean) {
        this._isInteractable = value;
    }

    open(isGameOver = false): void {
        this._isOpen = true;
        this._isInteractable = false;
    }

    scaleUp(): void {
        if (!this.isInteractable || this.isOpen) return;
        this.setScale(this.size / this.width * 1.05);
    }

    scaleDown(): void {
        if (!this.isInteractable || this.isOpen) return;
        this.setScale(this.size / this.width);
    }

    async handlePointerDown(): Promise<void> {
        if (!this.isInteractable || this.isOpen) return;
        const move: MoveInfo[] = await Api.sendMove(this.positionInGridX, this.positionInGridY);
        console.log("MOVE_ID: " + move[0].id)
        Api.listenToMoveAnsweredEvent(move[0].id, (gameId, moveId, result, rewardValue, isGameOver) => {
            console.log("MOVE ANSWERED RAISED" + `gameId=${gameId}` + `isGameOver=${isGameOver}`)
            this.updateView();
        });
    }

    updateView(): void {
        Api.getCellDetails(this.positionInGridX, this.positionInGridY).then((cellDetails) => {
            const cellId = cellDetails.coordinate.toString().length == 1 ? `0${cellDetails.coordinate.toString()}` : cellDetails.coordinate.toString();
            let imageUrl = cellDetails.image.replace("{id}", cellId);
            let textureKey = 'textureKey_' + cellDetails.coordinate;
            this.scene.load.image(textureKey, imageUrl);
            this.scene.load.once('complete', () => {
                this.setTexture(textureKey).setScale(this.size / this.width);
            });
            this.scene.load.start();
        });
    }
}
