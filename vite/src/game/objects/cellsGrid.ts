import * as Constants from "../constants/gameConstants";
import Cell from "../objects/cell";
import Phaser, { Scene } from "phaser";
import {store} from "@store";

export default class CellsGrid {
    public readonly CellSize = Constants.CELL_SIZE;
    public readonly CellSpacing = Constants.CELL_SPACING;

    private _grid: Cell[][];
    private _gridX: number;
    private _gridY: number;
    private _offsetX: number;
    private _offsetY: number;
    private _overlay: Phaser.GameObjects.Rectangle;
    private _spaceBarPressed: boolean = false;
    private _overlayText: Phaser.GameObjects.Text;

    constructor(scene: Scene, gridSize: number, startX: number, startY: number, gridX: number, gridY: number) {
        this._gridX = gridX;
        this._gridY = gridY;
        this._offsetX = startX;
        this._offsetY = startY;
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
        this.createOverlay(scene, gridSize);
    }

    private createCells(scene: Scene, gridSize: number): void {
        this._grid = Array(gridSize)
            .fill(null)
            .map((_, rowIndex: number) => {
                return Array(gridSize)
                    .fill(null)
                    .map((_, colIndex: number) => {
                        const x = colIndex * (this.CellSize + this.CellSpacing) + this.CellSize / 2 + this._offsetX;
                        const y = rowIndex * (this.CellSize + this.CellSpacing) + this.CellSize / 2 + this._offsetY;
                        const cell = new Cell(scene, rowIndex * gridSize + colIndex, x, y, this.CellSize, colIndex, rowIndex, this._gridX, this._gridY);
                        scene.add.existing(cell);
                        return cell;
                    });
            });
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

        this._overlayText = new Phaser.GameObjects.Text(
            scene,
            this._offsetX + overlayWidth / 2,
            this._offsetY + overlayWidth / 2,
            "click to initialize game",
            {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }
        );
        this._overlayText.setOrigin(0.5);

        this._overlay.setInteractive();
        this._overlay.on('pointerdown', this.hideOverlay.bind(this, scene, gridSize));
        scene.add.existing(this._overlay);
        scene.add.existing(this._overlayText);
    }

    private hideOverlay(scene: Scene, gridSize: number): void {
        if (this._spaceBarPressed || !store.getState().wallet.isConnected) {
            return;
        }

        this._overlay.setVisible(false);
        this._overlayText.setVisible(false);
        this.createCells(scene, gridSize);
        this.updateCellsView();
    }

    public clear(): void {
        this._grid.flat().forEach(cell => cell.destroy());
    }

    public filter(predicate: (cell: Cell) => boolean): Cell[] {
        return this._grid.flat().filter(predicate);
    }

    private updateCellsView(): void {
        this._grid.forEach((row: Cell[]) => {
            row.forEach((cell: Cell) => {
                cell.updateView();
            });
        });
    }

    get length(): number {
        return this._grid.length;
    }
}
