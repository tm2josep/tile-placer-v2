export default class KeyboardManager {
    constructor(keyset, matrix) {
        this.matrix = matrix;
        let buttons = Object.values(keyset);
        this.keyStates = new Map();
        buttons.forEach((b) => {
            this.keyStates.set(b, false);
        });

        document.addEventListener('keydown', (event) => {
            this.keyStates.set(keyset[event.key], true);
        });

        document.addEventListener('keyup', (event) => {
            this.keyStates.set(keyset[event.key], false);
        });
    }

    get movingState() {
        let pos = { x: 0, y: 0 }

        if (this.keyStates.get("UP")) {
            pos.y--;
        }

        if (this.keyStates.get("DOWN")) {
            pos.y++;
        }

        if (this.keyStates.get("LEFT")) {
            pos.x--;
        }

        if (this.keyStates.get("RIGHT")) {
            pos.x++;
        }

        return pos;
    }


}