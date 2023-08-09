import Phaser from 'phaser';
import Cell from '../objects/cell';
import CellsGrid from "../objects/cellsGrid";
import * as Constants from '../constants/gameConstants';

const INITIAL_GAME_ID = BigInt(-1);

export default class GameScene extends Phaser.Scene {
    private readonly gridSize = Constants.GRID_SIZE;
    private grid: CellsGrid;
    private isDragging: boolean;
    private dragStart: { x: number, y: number };
    private startCameraPos: { x: number, y: number };

    private zoomFactor: number = 1;
    private minZoom: number = 0.001;
    private maxZoom: number = 2;
    private zoomStep: number = 0.05;

    constructor() {
        super('GameScene');
    }

    create(): void {
        this.grid = new CellsGrid(this, this.gridSize);

        this.isDragging = false;
        this.input.on('pointerdown', this.startDrag, this);
        this.input.on('pointerup', this.stopDrag, this);
        this.input.on('pointermove', this.doDrag, this);
        this.input.on('wheel', this.zoomCamera, this);
    }

    startDrag(pointer: Phaser.Input.Pointer): void {
        if (!pointer.isDown) return;
        this.isDragging = true;
        this.dragStart = { x: pointer.x, y: pointer.y };
        this.startCameraPos = { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY };
    }

    doDrag(pointer: Phaser.Input.Pointer): void {
        if (!this.isDragging) return;
        const diffX = pointer.x - this.dragStart.x;
        const diffY = pointer.y - this.dragStart.y;
        this.cameras.main.setScroll(this.startCameraPos.x - diffX, this.startCameraPos.y - diffY);
    }

    stopDrag(): void {
        this.isDragging = false;
    }

    zoomCamera(pointer: Phaser.Input.Pointer, deltaX: number, deltaY: number, deltaZ: number): void {
        console.log('Wheel event detected', pointer.deltaY);

        if (pointer.deltaY < 0) {
            this.zoomFactor = Phaser.Math.Clamp(this.zoomFactor + this.zoomStep, this.minZoom, this.maxZoom);
        } else {
            this.zoomFactor = Phaser.Math.Clamp(this.zoomFactor - this.zoomStep, this.minZoom, this.maxZoom);
        }

        this.cameras.main.setZoom(this.zoomFactor);
    }
}
