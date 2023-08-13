import Phaser, {Scene} from 'phaser';
import { SPRITES } from "../constants/assetConstants";
import * as Api from "../../api/api"
import {store} from "@store";
import {ApiStatus} from "@stateTypes";

export default class Cell extends Phaser.GameObjects.Image {
    private readonly size: number;
    private _gridIndex: number;
    private _isOpen: boolean;
    private readonly positionInGridX: number;
    private readonly positionInGridY: number;
    private _spaceBarPressed: boolean = false;

    constructor(scene: Phaser.Scene, gridIndex: number, x: number, y: number, size: number, positionInGridX: number, positionInGridY: number) {
        super(scene, x, y, SPRITES.CELL.KEY);

        this.positionInGridX = positionInGridX;
        this.positionInGridY = positionInGridY;

        this._gridIndex = gridIndex;
        this.size = size;
        this.setOrigin(0.5, 0.5).setInteractive().setScale(this.size / this.width);
        this._isOpen = false;

        this.on('pointerover', this.scaleUp);
        this.on('pointerout', this.scaleDown);
        this.on('pointerdown', this.handlePointerDown);
        this.setupKeyboardListeners(scene);
    }

    private setupKeyboardListeners(scene: Scene): void {
        scene.input.keyboard.on('keydown-SPACE', () => {
            this._spaceBarPressed = true;
        });

        scene.input.keyboard.on('keyup-SPACE', () => {
            this._spaceBarPressed = false;
        });
    }

    get gridIndex(): number {
        return this._gridIndex;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    scaleUp(): void {
        if (!this.checkCellInteractable() || this.isOpen) return;
        this.setScale(this.size / this.width * 1.05);
    }

    scaleDown(): void {
        if (!this.checkCellInteractable() || this.isOpen) return;
        this.setScale(this.size / this.width);
    }

    async handlePointerDown(): Promise<void> {
        if (!this.checkCellInteractable() || this.isOpen) return;
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

    checkCellInteractable(): boolean {
        return !this._spaceBarPressed
            || store.getState().api.status == ApiStatus.STARTED
            || store.getState().api.status == ApiStatus.PENDING
            || store.getState().api.status == ApiStatus.WAITING_RESPONSE;
    }
}
