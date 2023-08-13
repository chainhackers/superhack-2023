import Phaser from 'phaser';
import CellsGrid from "../objects/cellsGrid";
import * as Constants from '../constants/gameConstants';

export default class GameScene extends Phaser.Scene {
    private readonly gridSize = Constants.GRID_SIZE;
    private isDragging: boolean;
    private dragStart: { x: number, y: number };
    private startCameraPos: { x: number, y: number };

    private zoomFactor: number = 1;
    private minZoom: number = 0.7;
    private maxZoom: number = 2;
    private zoomStep: number = 0.05;
    private grids: CellsGrid[][];

    private spaceKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super('GameScene');
    }

    create(): void {
        this.grids = Array(10).fill(null).map((_, row) => {
            return Array(10).fill(null).map((_, col) => {
                const offsetX = col * 10 * Constants.CELL_SIZE + col * 10 * Constants.CELL_SPACING;
                const offsetY = row * 10 * Constants.CELL_SIZE + row * 10 * Constants.CELL_SPACING;
                return new CellsGrid(this, this.gridSize, offsetX, offsetY);
            });
        });


        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.isDragging = false;
        this.input.on('pointerdown', this.startDrag, this);
        this.input.on('pointerup', this.stopDrag, this);
        this.input.on('pointermove', this.doDrag, this);
        this.input.on('wheel', this.zoomCamera, this);
    }

    startDrag(pointer: Phaser.Input.Pointer): void {
        if (!pointer.isDown || !this.spaceKey.isDown) return;
        this.isDragging = true;
        this.dragStart = { x: pointer.x, y: pointer.y };
        this.startCameraPos = { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY };
    }

    doDrag(pointer: Phaser.Input.Pointer): void {
        if (!this.isDragging || !this.spaceKey.isDown) return;
        const diffX = pointer.x - this.dragStart.x;
        const diffY = pointer.y - this.dragStart.y;
        this.cameras.main.setScroll(this.startCameraPos.x - diffX, this.startCameraPos.y - diffY);
    }

    stopDrag(): void {
        this.isDragging = false;
    }

    zoomCamera(pointer: Phaser.Input.Pointer): void {
        if (pointer.deltaY < 0) {
            this.zoomFactor = Phaser.Math.Clamp(this.zoomFactor + this.zoomStep, this.minZoom, this.maxZoom);
        } else {
            this.zoomFactor = Phaser.Math.Clamp(this.zoomFactor - this.zoomStep, this.minZoom, this.maxZoom);
        }

        this.cameras.main.setZoom(this.zoomFactor);
    }
}
