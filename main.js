import { Graph } from './graph.js';
import { GraphPainter } from "./GraphPainter.js";
import config from "./config.js";
import { Matrix } from "./Matrix.js";
import utils from "./utils.js"


const canvas = document.getElementById('myCanvas');

const randomMatrix = new Matrix(config.NODES_NUMBER);

randomMatrix.randomFill(config.K * 2);
randomMatrix.map((el) => el >= 1 ? 1 : 0);

const directedGraph = new Graph(randomMatrix, true);
Graph.createWeightedGraph(randomMatrix);
const graphPainter = new GraphPainter(directedGraph, canvas);

utils.drawBackground(canvas);
graphPainter.draw();
document.addEventListener('keydown', function(event) {
    //drawBackground();

    if(event.key === 'Enter') {

    }
});
