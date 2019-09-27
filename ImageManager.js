import { makeTileLayer } from "./loaders.js";
import ImageInput from "./ImageInput.js";

export default class ImageManager extends Map {
    constructor(parent, defaultDraw) {
        super();
        this.set('Default', defaultDraw);
        this.parent = parent;
        this.defaultDraw = defaultDraw;
        this.selected = '';
        this.render();
    }

    get(key) {
        if (!this.has(key) || key === 'Default') {
            return this.defaultDraw;
        } else {
            return makeTileLayer(super.get(key));
        }
    }

    renderUploads() {
        this.parent.querySelectorAll('button').forEach(button => {
            button.remove();
        });
        this.forEach((_, key) => {
            let b = document.createElement('button')
            b.innerText = key;
            b.id = key;
            this.parent.appendChild(b);

            let buttons = this.parent.querySelectorAll('button')
            buttons.forEach((button) => {
                button.addEventListener('click', () => {
                    this.selected = button.id;
                    buttons.forEach(nb => nb.style = 'background-color: white');
                    button.style = "background-color: grey"
                })
            });

        });
    }

    render() {
        this.parent.innerHTML = '';
        new ImageInput(this.parent, (image, name) => {
            this.set(name, image);
            this.renderUploads();
        })
    }

    draw(key, context, x, y) {
        this.get(key)(context, x, y);
    }
}
