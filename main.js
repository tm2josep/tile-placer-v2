import { Matrix } from './Matrix.js';
import ImageManager from './ImageManager.js';
import KeyboardManager from './KeyboardManager.js';
import { TILE_SIZE } from './Constants.js';
import MouseInput from './MouseInput.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

let imageManager = new ImageManager(document.getElementById('selections'), (context, i, j) => {
    context.clearRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
});
const cells = new Matrix(imageManager);
let mouseManager = new MouseInput(canvas);
const keyManager = new KeyboardManager({
    'w': "UP",
    'a': "LEFT",
    's': "DOWN",
    'd': "RIGHT"
}, cells);
mouseManager.callback = (x, y) => {
    cells.set(imageManager.selected, x, y);
}

let moveInterval = 75;
let newTime = 0;
function update(time) {
    requestAnimationFrame(update);
    let move = keyManager.movingState;
    if ((time - newTime) > moveInterval) {
        cells.shiftView(move.x, move.y);
        newTime = time;
    }
    cells.draw(context);
}
requestAnimationFrame(update);

document.getElementById('create').addEventListener('click', () => {
    let str = cells.stringify();
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
})