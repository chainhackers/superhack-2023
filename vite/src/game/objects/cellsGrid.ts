import * as Constants from "../constants/gameConstants";
import Cell from "../objects/cell";
import Phaser, { Scene } from "phaser";

export default class CellsGrid {
    public readonly CellSize = Constants.CELL_SIZE;
    public readonly CellSpacing = Constants.CELL_SPACING;

    private _grid: Cell[][];
    private _offsetX: number;
    private _offsetY: number;

    private _isInteractable: boolean = true;

    constructor(scene: Scene, gridSize: number) {
        this.create(scene, gridSize);
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

    public setCellsDisabled(): void {
        this.setCellsInteractable(false);
        this._grid.forEach((row: Cell[]) => {
            row.forEach((cell: Cell) => {
                cell.setTint(Constants.CELL_DISABLED_TINT);
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
