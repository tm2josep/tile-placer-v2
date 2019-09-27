import { TILE_SIZE } from "./ConfigElements.js";

/**
 * load an image from a url
 * 
 * @param {String} url 
 */
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => {
            resolve(image);
        }
        image.onerror = () => {
            reject('image failed load');
        }
        image.src = url;
    });
}

/**
 * Make a draw function from an image
 * 
 * @param {Image} image 
 */
export function makeTileLayer(image) {
    let {value: tileSize} = TILE_SIZE;
    const buffer = document.createElement('canvas');
    buffer.width = tileSize;
    buffer.height = tileSize;
    buffer.getContext('2d').drawImage(image, 0, 0, tileSize, tileSize);
    return (context, i, j) => {
        context.drawImage(buffer, i * tileSize, j * tileSize, tileSize, tileSize);
    }
}