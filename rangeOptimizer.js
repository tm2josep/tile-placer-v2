export function rangeOptimizer(coOrdinates) {
    let prog = document.getElementById('progress');
    prog.innerHTML = `0%`;
    // coordinates is an array of x, y length 2 arrays.
    let newCoords = [...coOrdinates];
    let rectangles = [];
    while (newCoords.length > 0) {
        let bigBox = getBiggestRectangle(newCoords);
        rectangles.push(bigBox);
        for (let i = 0; i < bigBox.width; i++) {
            for (let j = 0; j < bigBox.height; j++) {
                newCoords.splice(
                    newCoords.findIndex(
                        (value) => value[0] === (i + bigBox.xStart)
                            && value[1] === (j + bigBox.yStart)
                    ),
                    1
                )
            }
        }
        prog.innerHTML = `${100 - (newCoords.length / coOrdinates.length)}%`;
    }

    return rectangles.map(({xStart, yStart, width, height}) => {
        return [xStart, yStart, width, height];
    });

}

export function getBiggestRectangle(coOrdinates) {
    let maxSize = 0;
    let biggestRectangle = {};
    coOrdinates.forEach(position => {
        let rectangle = findPossibleRectangle(position, coOrdinates);
        let size = rectangle.width * rectangle.height;
        if (size > maxSize) {
            maxSize = size;
            biggestRectangle = rectangle;
        }
    });

    return biggestRectangle;
}

export function findPossibleRectangle(position, coOrdinates) {
    let width = 1;
    let height = 1;

    while (isARectangle(position, ++width, height, coOrdinates)) { }
    --width;

    while (isARectangle(position, width, ++height, coOrdinates)) { }
    --height;

    return {
        xStart: position[0],
        width,
        yStart: position[1],
        height,
    }

}

export function isARectangle(position, width, height, coOrdinates) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            // Search the filled positions to find if the position exists.
            let pos = coOrdinates.find(
                (spot) => spot[0] === (i + position[0])
                    && spot[1] === (j + position[1])
            );
            if (pos === undefined) {
                return false;
            }
        }
    }

    return true;
}