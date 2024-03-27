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

function drawQuadraticCurveWithArrow(ctx, startPoint, endPoint, controlPoint, directed) {
    ctx.strokeStyle = config.NODE_COLOUR;
    ctx.fillStyle = config.NODE_COLOUR;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    if (!directed) return;
    const angle = Math.atan2(endPoint.y - controlPoint.y, endPoint.x - controlPoint.x);

    const pullBackDistance = 20;
    const pullBackX = endPoint.x - pullBackDistance * Math.cos(angle);
    const pullBackY = endPoint.y - pullBackDistance * Math.sin(angle);


    const arrowSize = 10;
    ctx.save();
    ctx.translate(pullBackX, pullBackY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-arrowSize, -arrowSize / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowSize, arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCircle(ctx, point, radius, angleInDegrees) {
    ctx.fillStyle = config.NODE_COLOUR;
    const distance = 20;
    const angle = angleInDegrees * Math.PI / 180;
    const x = point.x + distance * Math.cos(angle);
    const y = point.y + distance * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.stroke();
}


export default {
    printMatrix,
    copyMatrix,
    calculateEndpoint,
    logPoints,
    drawNumberedCircle,
    drawStraightLine,
    drawQuadraticCurveWithArrow,
    drawCircle,

}