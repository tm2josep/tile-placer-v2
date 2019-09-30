import { Matrix } from './Matrix.js';
import ImageManager from './ImageManager.js';
import KeyboardManager from './KeyboardManager.js';
import { TILE_SIZE } from './ConfigElements.js';
import MouseInput from './MouseInput.js';
const worker = new Worker('./rangeWorker.js');

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
    let move = keyManager.movingState;
    if ((time - newTime) > moveInterval) {
        cells.shiftView(move.x, move.y);
        newTime = time;
    }
    cells.draw(context);
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

document.getElementById('create').addEventListener('click', () => {
    worker.postMessage(cells.stringify());
});

let prog = document.getElementById('progress');
worker.onmessage = ({ data: message }) => {
    if (message.type === 'download') {
        downloadNow(message.data);
    } if (message.type === 'progress') {
        prog.innerHTML = message.data;
    }
}

function downloadNow(dataStr) {
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
}