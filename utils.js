import { Point } from "./Point.js"
import config from "./config.js";

function printMatrix(matrix) {
    console.log('-------------------------------------');
    for (let i = 0; i < matrix.length; i++) {
        let row = '';
        for (let j = 0; j < matrix[i].length; j++) {
            row += matrix[i][j] + '\t';
        }
        console.log(row);
    }
    console.log('-------------------------------------');
}

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

function drawNumberedCircle(ctx, pos, number) {
    ctx.strokeStyle = config.NODE_COLOUR;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, config.NODE_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = config.NODE_FILL_STYLE;
    ctx.fill();

    ctx.fillStyle = config.NODE_COLOUR;
    ctx.font = `${config.FONT_SIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, pos.x, pos.y);
}


function drawStraightLine(ctx, startPoint, endPoint, directed) {
    ctx.fillStyle = config.NODE_COLOUR;
    ctx.strokeStyle = config.NODE_COLOUR
    const arrowSize = 10;
    const pullBackDistance = 20;
    const lineLength = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));

    const ratio = (lineLength - pullBackDistance) / lineLength;
    const newEndPoint = {
        x: startPoint.x + (endPoint.x - startPoint.x) * ratio,
        y: startPoint.y + (endPoint.y - startPoint.y) * ratio
    };

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(newEndPoint.x, newEndPoint.y);
    ctx.stroke();
    if (!directed) return;
    const angle = Math.atan2(newEndPoint.y - startPoint.y, newEndPoint.x - startPoint.x);

    ctx.save();
    ctx.translate(newEndPoint.x, newEndPoint.y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowSize, -arrowSize / 2);
    ctx.lineTo(-arrowSize, arrowSize / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawQuadraticCurveWithArrow1(ctx, startPoint, endPoint, controlPoint, directed) {
    ctx.strokeStyle = config.NODE_COLOUR;
    ctx.fillStyle = config.NODE_COLOUR;
    const t = 1;
    const x = Math.pow(1 - t, 2) * startPoint.x + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * endPoint.x;
    const y = Math.pow(1 - t, 2) * startPoint.y + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * endPoint.y;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    const dx = 2 * (1 - t) * (controlPoint.x - startPoint.x) + 2 * t * (endPoint.x - controlPoint.x);
    const dy = 2 * (1 - t) * (controlPoint.y - startPoint.y) + 2 * t * (endPoint.y - controlPoint.y);
    const angle = Math.atan2(dy, dx);

    if (!directed) return;
    const reversedArrowX = x + config.ARROW_SIZE * Math.cos(angle);
    const reversedArrowY = y + config.ARROW_SIZE * Math.sin(angle);
    ctx.save();
    ctx.translate(reversedArrowX, reversedArrowY);
    ctx.rotate(angle + Math.PI);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(config.ARROW_SIZE, config.ARROW_SIZE / 2);
    ctx.lineTo(config.ARROW_SIZE, -config.ARROW_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawQuadraticCurveWithArrow(ctx, startPoint, endPoint, controlPoint, directed){
    let point1;
    point1 = findPointOnCircle(controlPoint, endPoint, directed);
    drawQuadraticCurveWithArrow1(ctx, startPoint, point1, controlPoint, directed);
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

function drawCircle(ctx, point, radius, angleInDegrees) {
    ctx.strokeStyle = config.NODE_COLOUR;
    const distance = 20;
    const angle = angleInDegrees * Math.PI / 180;
    const x = point.x + distance * Math.cos(angle);
    const y = point.y + distance * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 4);
    ctx.stroke();
}


export default {
    printMatrix,
    fillMatrix,
    copyMatrix,
    calculateEndpoint,
    logPoints,
    drawNumberedCircle,
    drawStraightLine,
    drawQuadraticCurveWithArrow,
    drawCircle,

}