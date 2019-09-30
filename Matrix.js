import { TILE_SIZE } from "./ConfigElements.js";

export class Matrix {
    constructor(imageManager) {
        this.imageManager = imageManager;
        this.grid = [];
        this.defaultValue = 'Default';
        this.offset = { x: 0, y: 0 }
    }

    find(val) {
        const values = [];

        this.grid.forEach((col, x) => {
            col.forEach((cell, y) => {
                if (cell === val) {
                    values.push({ x, y });
                }
            })
        });

        return values;
    }

    shiftView(x, y) {
        this.offset.x += x;
        this.offset.y += y;
    }

    set(val, x, y) {
        x += this.offset.x;
        y += this.offset.y;
        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = val;
    }

    get(x, y) {
        x += this.offset.x;
        y += this.offset.y;
        if (!this.grid[x]) {
            return this.defaultValue;
        }

        if (!this.grid[x][y]) {
            return this.defaultValue;
        }

        return this.grid[x][y];
    }

    /**
     * runs the draw function assigned to the cell
     * coords sent in by index, not position
     * 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        for (let x = 0; x < Math.ceil(500 / TILE_SIZE.value); x++) {
            for (let y = 0; y < Math.ceil(500 / TILE_SIZE.value); y++) {
                this.imageManager.draw(this.get(x, y), context, x, y)
            }
        }
    }

    stringify() {
        let names = Array.from(this.imageManager.keys()).filter(name => name !== this.defaultValue);
        let o = {};
        names.forEach(name => {
            o[name] = this.find(name).map(({ x, y }) => [x, y]);
        });
        return o;
    }

    trim() {
        let firstNonDefaultColumnIndex = 0;

        this.grid.some((column, colIndex) => {
            if (column.every(cell => cell !== this.defaultValue)) {
                firstNonDefaultColumnIndex = colIndex;
                return true;
            }

            return false;
        });

        console.log(firstNonDefaultColumnIndex);

        for (let i = 0; i < firstNonDefaultColumnIndex; i++) {
            this.grid.shift();
        }

        return firstNonDefaultColumnIndex;
    }
}