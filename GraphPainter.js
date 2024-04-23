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
        this.isDrawn = utils.fillMatrix([], this.n);
        this.curvedLinePainter = {0 : (a, b, directed, isOnly, colour) =>{
                const k = isOnly ? 1.1 : 1.2;
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(Math.max(b.x, a.x) * k, Math.min(b.y, a.y) * 0.8 ), directed, colour);
            },
            1: (a, b, directed, isOnly, colour) =>{
                const k = isOnly ? 1.3 : 1.5;
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point((b.x + a.x)/ 2, a.y * k), directed, colour);
            },
            2: (a, b, directed, isOnly, colour) =>{
                const k = isOnly ? 0.7 : 0.9;
                utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(Math.min(b.x, a.x) * k, Math.min(b.y, a.y) * k), directed, colour);
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
        let distance = config.TOTAL_LENGTH / (n) ;
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
                distance = config.TOTAL_LENGTH / (n) ;
            }
            else {
                distance -= length;
                const nodePos = utils.calculateEndpoint(currentPos, angle, length);
                this.nodesEdge[this.nodesEdge.length - 1][1]++;
                length = config.LENGTH;
                angle += config.ROTATION_ANGLE;
                currentPos = nodePos;
                currentEdge++;
            }
        }
    }
    drawNodes(){
        for (let i = 0; i < this.n; i++){
            utils.drawNumberedCircle(this.ctx, this.nodesPos[i], i + 1);
        }
    }

    drawColoredNodes(visited){
        for (let i = 0; i < this.n; i++){
            const colour = visited[i] ? config.DFS_COLOUR : config.NODE_FILL_STYLE;
            utils.drawNumberedCircle(this.ctx, this.nodesPos[i], i + 1, colour);
        }
    }

    draw(){
        if (this.graph.directed)
            this.drawDirectedGraph();
        else
            this.drawUndirectedGraph();
        this.isDrawn = utils.fillMatrix([], this.n);
    }

    drawLine(i, j, colour = config.ARROW_COLOUR){
        const a = this.nodesPos[i];
        const b = this.nodesPos[j];
        const isFirst = !this.isDrawn[j][i];
        this.isDrawn[i][j] = 1;
        const type = this.findConnectionType(i, j);
        switch (type) {
            case 0:
                this.drawLoop(i, colour);
                break;
            case 1:
                if (isFirst) {
                    utils.drawStraightLine(this.ctx, a, b, 1, colour);
                } else {
                    this.curvedLinePainter[this.findCommonEdge(i, j)](a, b, 1, 0, colour);
                }
                break;
            case 2:
                if (isFirst) {
                    this.curvedLinePainter[this.findCommonEdge(i, j)](a, b, 1, 1, colour);
                }
                else {
                    this.curvedLinePainter[this.findCommonEdge(i, j)](a, b, 1, 0, colour);
                }
                break;
            case 3:
                if (isFirst) {
                    utils.drawStraightLine(this.ctx, a, b, 1, colour);
                } else {
                    utils.drawQuadraticCurveWithArrow(this.ctx, a, b, new Point(this.canvasWidth/2, this.canvasHeight/2), 1, colour);
                }
                break;
        }
    }

    drawDirectedGraph(){
        const matrix = this.graph.adjacencyMatrix;
        this.isDrawn = utils.fillMatrix([], this.n);
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++) {
                if (!matrix[i][j]) continue;
                this.drawLine(i, j);

            }
        }
        this.drawNodes();
    }


    drawUndirectedGraph(){
        const matrix = this.graph.adjacencyMatrix;
        for (let i = 0; i < this.n; i++){
            for (let j = i; j < this.n; j++){
                if (!matrix[i][j]) continue;
                if ( i === j){
                    this.drawLoop(i);
                }
                const a = this.nodesPos[i];
                const b = this.nodesPos[j];
                if (this.isConnectionStraight(i, j)) {
                    utils.drawStraightLine(this.ctx, a, b, 0);
                }
                else{
                    this.curvedLinePainter[this.findCommonEdge(i, j)](a, b, 0, 1)
                }
            }
        }
        this.drawNodes();
    }


    isConnectionStraight(node1, node2){
        const element = [node1, node2];
        const node1Pos = this.nodesEdge[node1];
        const node2Pos = this.nodesEdge[node2];

        return (!(node1Pos.includes(node2Pos[0]) || node1Pos.includes(node2Pos[1])) ||
            (Math.abs(node1 - node2 ) < 2) ||
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
    drawLoop(i, colour){
        const pos = this.nodesPos[i];
        const edge =  this.nodesEdge[i][0];
        const angle = {0 : 300, 1: 90, 2: 210}
        utils.drawCircle(this.ctx, pos, 30, angle[edge], colour);
    }

    findConnectionType(i, j){
        if (j === i){
            return 0;
        }
        if (Math.abs(i - j ) < 2) {
            return 1;
        }
        if (!this.isConnectionStraight(i, j)){
            return 2
        }
        return 3;
    }

    *DFS(paths){
        const visited = new Array(this.n).fill(false);
        for (const list of paths){
            let current = 1;
            let previous = 0;
            visited[list[0]] = true;
            this.drawColoredNodes(visited);
            yield ;
            while (current < list.length){
                if (!this.graph.adjacencyMatrix[list[previous]][list[current]]) {
                    previous--;
                }
                else{
                    this.drawLine(list[previous], list[current], 'red');
                    visited[list[current]] = true;
                    this.drawColoredNodes(visited);
                    current++;
                    previous = current - 1;
                    yield ;

                }
            }
        }
    }

    findStartNode(visited){
        for (let i = 0; i < this.graph.adjacencyMatrix.length; i++){
            if (!visited[i] && this.graph.adjacencyMatrix[i].findIndex((e) => e) !== -1)
                return i;
        }
        return visited.findIndex((e) => !e);
    }

    *BFS(){
        let visited = [];
        const adjMatrix = this.graph.adjacencyMatrix;
        for (let i = 0; i < adjMatrix.length; i++) {
            visited[i] = false;
        }
        let currentNode = this.findStartNode(visited)

        while (currentNode !== -1) {
            const queue = [];
            visited[currentNode] = true;
            queue.push(currentNode);
            this.drawColoredNodes(visited);
            yield;
            while (queue.length !== 0) {
                let currentVertex = queue.shift();
                for (let i = 0; i < adjMatrix[currentVertex].length; i++) {
                    if (adjMatrix[currentVertex][i] === 1 && !visited[i]) {
                        this.drawLine(currentVertex, i, 'red');
                        visited[i] = true;
                        this.drawColoredNodes(visited);
                        yield;
                        queue.push(i);
                    }
                }
            }
            currentNode = this.findStartNode(visited);
        }
    }


}

export { GraphPainter }