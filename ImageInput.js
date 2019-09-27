import { loadImage } from "./loaders.js";

export default class ImageInput {
    constructor(parent, callback) {
        this.parent = parent;

        const add = document.createElement('input');
        add.type = 'file';
        add.accept = 'image/png, image/jpeg';
        add.innerHTML = 'Add new Image';
        add.multiple = true;
        this.parent.appendChild(add);

        add.addEventListener('input', (event) => {
            let files = event.target.files;
            Promise.all(
                this.loadImagesFromFiles(files)
            ).then((images) => {
                images.forEach((image) => {
                    callback(image.image, image.name);
                });
            });
            event.target.value = "";
        });
    }

    loadImagesFromFiles(files) {
        return Array.from(files).map((file) => {
            return new Promise((resolve) => {
                const fr = new FileReader();
                fr.onload = function () {
                    loadImage(fr.result).then((image) => resolve({
                        image,
                        name: file.name.replace(/\.png|\.jpeg/, '')
                    }));
                }
                fr.readAsDataURL(file);
            });
        })
    }
}