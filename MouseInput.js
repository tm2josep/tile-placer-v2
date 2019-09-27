import { TILE_SIZE } from "./ConfigElements.js";

export default class MouseInput {
    constructor(canvas) {
        canvas.addEventListener('click', event => {
            this.clicked(event.offsetX, event.offsetY);
        });
        canvas.addEventListener('mousemove', event => {
            if (event.buttons === 1) {
                this.clicked(event.offsetX, event.offsetY);
            }
        })
    }

    set callback(cb) {
        this._callback = cb;
    }

    clicked(x, y) {
        x = Math.floor(x / TILE_SIZE.value);
        y = Math.floor(y / TILE_SIZE.value);
        this._callback(x, y);
    }
}