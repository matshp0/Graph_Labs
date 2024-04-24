import { Graph } from './graph.js';
import { GraphPainter } from "./GraphPainter.js";
import config from "./config.js";
import { Matrix } from "./Matrix.js";
import utils from "./utils.js"


const canvas = document.getElementById('myCanvas');

const randomMatrix = new Matrix(config.NODES_NUMBER);

randomMatrix.randomFill(config.K);

const directedGraph = new Graph(randomMatrix, true);
const graphPainter = new GraphPainter(directedGraph, canvas);
const generatorDFS = graphPainter.DFS(directedGraph.DFS());
const generatorBFS = graphPainter.BFS();
console.clear();
utils.drawBackground(canvas);
graphPainter.draw();
document.addEventListener('keydown', function(event) {
    //drawBackground();

    if(event.key === 'Enter') {
        generatorDFS.next();
    }
    if(event.key === ' ') {
        generatorBFS.next();
    }

});
