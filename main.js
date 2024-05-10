import { Graph } from './graph.js';
import { GraphPainter } from "./GraphPainter.js";
import config from "./config.js";
import { Matrix } from "./Matrix.js";
import utils from "./utils.js"



const canvas = document.getElementById('myCanvas');

const randomMatrix = new Matrix(config.NODES_NUMBER);

randomMatrix.randomFill(config.K * 2);
randomMatrix.map((el) => el >= 1 ? 1 : 0);

const weightedGraph = Graph.createWeightedGraph(randomMatrix);
const graphPainter = new GraphPainter(weightedGraph, canvas);

utils.drawBackground(canvas);
graphPainter.draw();
const parent = weightedGraph.primMST(weightedGraph.adjacencyMatrix);
const generator = graphPainter.primAlgorithm(parent);
console.log(parent);

document.addEventListener('keydown', function(event) {
    //drawBackground();

    if(event.key === 'Enter') {
        const data = generator.next();
        if (data.done){
            console.log("Algorithm finished")
            console.log("MST value : ", data.value);
        }
    }
});
