import { Point } from "./Point.js"
import utils from "./utils.js"
import config from "./config.js"


class GraphPainter{
    constructor(graph, canvas) {
        this.graph = graph;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvasHeight = canvas.height;
        this.canvasWidth = canvas.width;
        this.n = this.graph.numberOfNodes;
        this.curvedLinePainter = {0 : (a, b, directed) =>{
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(Math.max(b.x, a.x), Math.min(b.y, a.y) * 1.2), directed);
            },
            1: (a, b, directed) =>{
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point((b.x + a.x)/ 2, a.y * 1.4), directed);
            },
            2: (a, b, directed) =>{
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(Math.min(b.x, a.x), Math.min(b.y, a.y) * 1.2), directed);
            },
            '-1': (a, b, directed) =>{
            utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(Math.min(b.x, a.x), Math.min(b.y, a.y) * 1.2), directed);
            }
        }
        this.calculateNodesPositions();
    }
    calculateNodesPositions(){
        this.nodesPos = [];
        this.nodesEdge = []
        const n = this.graph.numberOfNodes;
        const distance = config.LENGTH * config.EDGES / (n) ;
        let currentPos = new Point(this.canvasWidth / 2, this.canvasHeight * 0.2);
        let currentEdge = 0;
        let angle = 60;
        let length = config.LENGTH;
        let node = 0;
        this.nodesPos.push(currentPos);
        this.nodesEdge.push([currentEdge, config.EDGES - 1]);
        while (node < n - 1) {
            if (length >= distance) {
                const nodePos = utils.calculateEndpoint(currentPos, angle, distance);
                this.nodesEdge.push([currentEdge, currentEdge]);
                this.nodesPos.push(nodePos);
                length -= distance;
                currentPos = nodePos;
                node ++;
            }
            else {
                const nodePos = utils.calculateEndpoint(currentPos, angle, length);
                this.nodesEdge[this.nodesEdge.length - 1][1]++;
                length = config.LENGTH;
                angle += config.ROTATION_ANGLE;
                currentPos = nodePos;
                currentEdge++;
            }
        }
        console.log(this.nodesEdge);
        utils.logPoints(this.nodesPos);
    }
    drawNodes(directed){
        const matrix = this.graph.directedMatrix
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++){
                if (!matrix[i][j]) continue;
                if ( i === j){
                    this.drawLoop(i);
                }
                const a = this.nodesPos[i];
                const b = this.nodesPos[j];
                if (this.isConnectionStraight(i, j)) {
                    utils.drawStraightLine(this.ctx, a, b, directed);
                }
                else{
                    this.curvedLinePainter[this.findCommonEdge(i, j)](a, b, directed)
                }
            }
        }
        for (let i = 0; i < this.n; i++){
            utils.drawNumberedCircle(this.ctx, this.nodesPos[i], i + 1);
        }
    }
    isConnectionStraight(node1, node2){
        const element = [node1, node2];
        const node1Pos = this.nodesEdge[node1];
        const node2Pos = this.nodesEdge[node2];

        return (!(node1Pos.includes(node2Pos[0]) || node1Pos.includes(node2Pos[1])) ||
            Math.abs(node1 - node2 ) < 2 ||
            (element.includes(this.n - 1)) && [node1, node2].includes(0));

    }
    findCommonEdge(i, j){
        const node1 = this.nodesEdge[i];
        const node2 = this.nodesEdge[j];
        for (let element1 of node1) {
            if (node2.includes(element1)) {
                return element1;
            }
        }
        return -1;
    }
    drawLoop(i){
        const pos = this.nodesPos[i];
        const edge =  this.nodesEdge[i][0];
        const angle = {0 : 300, 1: 90, 2: 210}
        utils.drawCircle(this.ctx, pos, 40, angle[edge]);
    }
}

export { GraphPainter }