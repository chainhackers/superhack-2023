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
        this.setTexture(SPRITES.CELL.HOVER.KEY).setScale(this.size / this.width);
    }

    scaleDown(): void {
        if (!this.isInteractable || this.isOpen) return;
        this.setTexture(SPRITES.CELL.KEY).setScale(this.size / this.width);
    }

    handlePointerDown(): void {
        if (!this.isInteractable || this.isOpen) return;
        Api.sendMove(this.positionInGridX, this.positionInGridY);
    }
}
