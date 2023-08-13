import * as Constants from "../constants/gameConstants";
import Cell from "../objects/cell";
import Phaser, { Scene } from "phaser";
import {store} from "@store";

export default class CellsGrid {
    public readonly CellSize = Constants.CELL_SIZE;
    public readonly CellSpacing = Constants.CELL_SPACING;

    private _grid: Cell[][];
    private _offsetX: number;
    private _offsetY: number;
    private _overlay: Phaser.GameObjects.Rectangle;
    private _isInteractable: boolean = true;
    private _spaceBarPressed: boolean = false;

    constructor(scene: Scene, gridSize: number) {
        this.create(scene, gridSize);
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

    private create(scene: Scene, gridSize: number): void {
        this._offsetX = (Constants.SCREEN_WIDTH - gridSize * this.CellSize) / 2;
        this._offsetY = (Constants.SCREEN_HEIGHT - gridSize * this.CellSize) / 2;

        this._grid = Array(gridSize)
            .fill(null)
            .map((_, rowIndex: number) => {
                return Array(gridSize)
                    .fill(null)
                    .map((_, colIndex: number) => {
                        const x = colIndex * (this.CellSize + this.CellSpacing) + this.CellSize / 2 + this._offsetX;
                        const y = rowIndex * (this.CellSize + this.CellSpacing) + this.CellSize / 2 + this._offsetY;
                        const cell = new Cell(scene, rowIndex * gridSize + colIndex, x, y, this.CellSize, colIndex, rowIndex);
                        scene.add.existing(cell);
                        return cell;
                    });
            });

        this.createOverlay(scene, gridSize);
    }

    private createOverlay(scene: Scene, gridSize: number): void {
        const overlayWidth = gridSize * (this.CellSize + this.CellSpacing) - this.CellSpacing;

        this._overlay = new Phaser.GameObjects.Rectangle(
            scene,
            this._offsetX + overlayWidth / 2, // centering the overlay relative to the grid
            this._offsetY + overlayWidth / 2,
            overlayWidth,
            overlayWidth,
            0x000000, 0.5
        );

        this._overlay.setInteractive();
        this._overlay.on('pointerdown', this.hideOverlay.bind(this));
        scene.add.existing(this._overlay);

        this.setCellsInteractable(false);
    }

    private hideOverlay(): void {
        if (this._spaceBarPressed || !store.getState().wallet.isConnected) {
            return;
        }

        this._overlay.setVisible(false);
        this.setCellsInteractable(true);
        this.updateCellsView();
    }

    public clear(): void {
        this._grid.flat().forEach(cell => cell.destroy());
    }

    public filter(predicate: (cell: Cell) => boolean): Cell[] {
        return this._grid.flat().filter(predicate);
    }

    public setCellsInteractable(interactable: boolean): void {
        this._grid.forEach((row: Cell[]) => {
            row.forEach((cell: Cell) => {
                cell.isInteractable = interactable;
            });
        });
        this._isInteractable = interactable;
    }

    private updateCellsView(): void {
        this._grid.forEach((row: Cell[]) => {
            row.forEach((cell: Cell) => {
                cell.updateView();
            });
        });
    }

    get isInteractable(): boolean {
        return this._isInteractable;
    }

    get length(): number {
        return this._grid.length;
    }

    get offsetX(): number {
        return this._offsetX;
    }

    get offsetY(): number {
        return this._offsetY;
    }

    get coveredCellsCount(): number {
        return this.filter(cell => !cell.isOpen).length;
    }

    get revealedCellsCount(): number {
        return this.filter(cell => cell.isOpen).length;
    }
}
