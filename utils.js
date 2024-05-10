import { Point } from "./Point.js"
import config from "./config.js";

function fillMatrix(matrix, n, a = 0){
    for (let i = 0; i < n; i++){
        const row = [];
        for (let j = 0; j < n; j++){
            row.push(a);
        }
        matrix.push(row);
    }
    return matrix
}


function drawBackground(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.fillStyle = config.BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function copyMatrix(matrix) {
    const copiedMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
        copiedMatrix.push([]);
        for (let j = 0; j < matrix[i].length; j++) {
            copiedMatrix[i][j] = matrix[i][j];
        }
    }
    return copiedMatrix;
}

function calculateEndpoint(pos, angleInDegrees, length) {
    const angleInRadians = angleInDegrees * Math.PI / 180;

    const endX = pos.x + length * Math.cos(angleInRadians);
    const endY = pos.y + length * Math.sin(angleInRadians);

    return new Point(endX, endY);
}

function logPoints(points) {
    points.forEach(point => {
        console.log(`(${point.x}, ${point.y})`);
    });
}

function drawNumberedCircle(ctx, pos, number, colour = config.NODE_FILL_STYLE) {
    ctx.strokeStyle = config.NODE_COLOUR;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, config.NODE_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = colour;
    ctx.fill();

    ctx.fillStyle = config.NODE_COLOUR;
    ctx.font = `${config.FONT_SIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, pos.x, pos.y);
}


function drawStraightLine(ctx, startPoint, endPoint, directed, colour = config.ARROW_COLOUR, number) {
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    const arrowSize = 10;
    const pullBackDistance = 20;
    const lineLength = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));

    const ratio = (lineLength - pullBackDistance) / lineLength;
    const ratio1 = 0.45;
    const newEndPoint = {
        x: startPoint.x + (endPoint.x - startPoint.x) * ratio,
        y: startPoint.y + (endPoint.y - startPoint.y) * ratio
    };
    const newEndPoint1 = {
        x: startPoint.x + (endPoint.x - startPoint.x) * ratio1,
        y: startPoint.y + (endPoint.y - startPoint.y) * ratio1
    };

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(newEndPoint.x, newEndPoint.y);
    ctx.stroke();


    ctx.restore();
    if (!number) return;
    const angle1 = Math.atan2(newEndPoint1.y - startPoint.y, newEndPoint1.x - startPoint.x);

    ctx.save();
    ctx.translate(newEndPoint1.x, newEndPoint1.y);
    ctx.font = config.WEIGHT_FONT;
    ctx.fillStyle = config.WEIGHTS_COLOUR;

    ctx.fillText(number, 0, 0);

    ctx.restore();
}

function drawQuadraticCurveWithArrow1(ctx, startPoint, endPoint, controlPoint, directed, colour, number) {
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;
    const tArrow = 1;
    const tNumber = 0.45;
    const x = Math.pow(1 - tArrow, 2) * startPoint.x + 2 * (1 - tArrow) * tArrow * controlPoint.x + Math.pow(tArrow, 2) * endPoint.x;
    const y = Math.pow(1 - tArrow, 2) * startPoint.y + 2 * (1 - tArrow) * tArrow * controlPoint.y + Math.pow(tArrow, 2) * endPoint.y;
    const x1 = Math.pow(1 - tNumber, 2) * startPoint.x + 2 * (1 - tNumber) * tNumber * controlPoint.x + Math.pow(tNumber, 2) * endPoint.x;
    const y1 = Math.pow(1 - tNumber, 2) * startPoint.y + 2 * (1 - tNumber) * tNumber * controlPoint.y + Math.pow(tNumber, 2) * endPoint.y;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    const dx = 2 * (1 - tArrow) * (controlPoint.x - startPoint.x) + 2 * tArrow * (endPoint.x - controlPoint.x);
    const dy = 2 * (1 - tArrow) * (controlPoint.y - startPoint.y) + 2 * tArrow * (endPoint.y - controlPoint.y);
    const dxNumber = 2 * (1 - tNumber) * (controlPoint.x - startPoint.x) + 2 * tNumber * (endPoint.x - controlPoint.x);
    const dyNumber = 2 * (1 - tNumber) * (controlPoint.y - startPoint.y) + 2 * tNumber * (endPoint.y - controlPoint.y);
    const angle = Math.atan2(dy, dx);


    if (!number) return;
    const angle1 = Math.atan2(dyNumber, dxNumber);
    const reversedArrowX1 = x1 + config.ARROW_SIZE * Math.cos(angle);
    const reversedArrowY1= y1 + config.ARROW_SIZE * Math.sin(angle);
    ctx.save();
    ctx.translate(reversedArrowX1, reversedArrowY1);
    ctx.font = config.WEIGHT_FONT;
    ctx.fillStyle = config.WEIGHTS_COLOUR;
    ctx.fillText(number, 0, 0);
    ctx.restore();

}

function drawQuadraticCurveWithArrow(ctx, startPoint, endPoint, controlPoint, directed, colour, number){
    let point1;
    point1 = findPointOnCircle(controlPoint, endPoint, directed);
    drawQuadraticCurveWithArrow1(ctx, startPoint, point1, controlPoint, directed, colour, number);
}

function findPointOnCircle(startPoint, endPoint, directed) {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    const unitX = dx / length;
    const unitY = dy / length;
    const pullback = directed ? config.ARROW_SIZE * Math.sin(Math.PI/3) + config.NODE_RADIUS : config.NODE_RADIUS;

    const newX = endPoint.x - pullback * unitX;
    const newY = endPoint.y - pullback * unitY;

    return new Point(newX, newY);
}

function drawCircle(ctx, point, radius, angleInDegrees, colour=config.ARROW_COLOUR) {
    ctx.strokeStyle = colour;
    const distance = 20;
    const angle = angleInDegrees * Math.PI / 180;
    const x = point.x + distance * Math.cos(angle);
    const y = point.y + distance * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 4);
    ctx.stroke();
}

function seededRandom(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    let currentSeed = seed % m;

    function random() {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m;
    }

    return random;
}


export default {
    drawBackground,
    fillMatrix,
    copyMatrix,
    calculateEndpoint,
    logPoints,
    drawNumberedCircle,
    drawStraightLine,
    drawQuadraticCurveWithArrow,
    drawCircle,
    seededRandom,

}