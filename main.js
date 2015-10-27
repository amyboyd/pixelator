'use strict';

const App = {
    canvas: undefined,

    context: undefined,

    init() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.drawOriginalImageOntoCanvas();

        const width = this.canvas.width;
        const height = this.canvas.height;

        App.splitAreaIntoBoxesAndRender(0, width, 0, height);
    },

    splitAreaIntoBoxesAndRender(xLeft, width, yTop, height) {
        const xSize = Math.ceil(width / 40);
        const ySize = Math.ceil(height / 40);
        const boxes = [];

        for (let x = 0; x < width; x += xSize) {
            for (let y = 0; y < height; y += ySize) {
                boxes.push({
                    xLeft: x,
                    xRight: x + xSize,
                    yTop: y,
                    yBottom: y + ySize,
                    width: xSize,
                    height: ySize
                });
            }
        }

        boxes.forEach(function(box) {
            box.colourAverages = App.getColourAverageInBox(box);
            App.setAreaToColour(box.xLeft, box.yTop, box.width, box.height, box.colourAverages);
        });
    },

    drawOriginalImageOntoCanvas() {
        const originalImage = document.getElementById('original-image');
        this.context.drawImage(originalImage, 0, 0);
    },

    getColourAverageInBox(box) {
        const colourTotals = {r: 0, g: 0, b: 0};
        const colours = App.context.getImageData(box.xLeft, box.yTop, box.width, box.height).data;

        for (let i = 0; i < colours.length; i += 4) {
            colourTotals.r += colours[i];
            colourTotals.g += colours[i + 1];
            colourTotals.b += colours[i + 2];
        }

        const pixelCount = box.width * box.height;

        return {
            r: Math.round(colourTotals.r / pixelCount),
            g: Math.round(colourTotals.g / pixelCount),
            b: Math.round(colourTotals.b / pixelCount),
        };
    },

    setAreaToColour(x, y, width, height, colour) {
        App.context.fillStyle = "rgba(" + colour.r + "," + colour.g + "," + colour.b + ",255)";
        App.context.fillRect(x, y, width, height);
    },
};

window.addEventListener('load', () => App.init());
