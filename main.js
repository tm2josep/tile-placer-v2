import { Matrix } from './Matrix.js';
import ImageManager from './ImageManager.js';
import KeyboardManager from './KeyboardManager.js';
import { TILE_SIZE } from './ConfigElements.js';
import MouseInput from './MouseInput.js';
import { rangeOptimizer } from './rangeOptimizer.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

let imageManager = new ImageManager(document.getElementById('selections'), (context, i, j) => {
    let { value: tileSize } = TILE_SIZE;
    context.clearRect(i * tileSize, j * tileSize, tileSize, tileSize);
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
    context.clearRect(0, 0, canvas.width, canvas.height);
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
    let obj = cells.stringify();
    let downLoadingObj = {};
    let keys = Object.keys(obj);
    keys.forEach(key => downLoadingObj[key] = rangeOptimizer(obj[key]));

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downLoadingObj));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
})