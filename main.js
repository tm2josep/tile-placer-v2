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

const keyManager = new KeyboardManager({
    'w': "UP",
    'a': "LEFT",
    's': "DOWN",
    'd': "RIGHT"
}, cells);

let mouseManager = new MouseInput(canvas);
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
    cells.trim.bind(cells)();
    worker.postMessage(cells.stringify.bind(cells)());
});

worker.onmessage = ({ data: message }) => {
    if (message.type === 'download') {
        downloadNow(message.data);
    } if (message.type === 'progress') {
        updateProgress(message.data);
    }
}

let prog = document.getElementById('progress');
updateProgress(0);
function updateProgress(progress) {
    prog.innerHTML = (progress === `100%`) ? 'Complete!' : progress;
}

function downloadNow(dataStr) {
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
}