import { TILE_SIZE } from "./Constants.js";

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
    const buffer = document.createElement('canvas');
    buffer.width = TILE_SIZE;
    buffer.height = TILE_SIZE;
    buffer.getContext('2d').drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);
    return (context, i, j) => {
        context.drawImage(buffer, i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}