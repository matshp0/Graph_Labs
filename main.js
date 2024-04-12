import { Graph } from './graph.js';
import { GraphPainter } from "./GraphPainter.js";
import config from "./config.js";
import { Matrix } from "./Matrix.js";



function drawBackground() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.fillStyle = config.BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


drawBackground();

const canvas = document.getElementById('myCanvas');

const randomMatrix = new Matrix(config.NODES_NUMBER);
const randomMatrix1 = new Matrix(config.NODES_NUMBER);

randomMatrix.randomFill(config.K);
randomMatrix1.randomFill(config.K1);

const directedGraph = new Graph(randomMatrix, true);
const undirectedGraph = new Graph(randomMatrix, false);
const directedGraph1 = new Graph(randomMatrix1, true)
const condensationGraph = directedGraph1.getCondensationGraph();

const directedGraphPainter = new GraphPainter(directedGraph, canvas);
const undirectedGraphPainter = new GraphPainter(undirectedGraph, canvas);
const directedGraphPainter1 = new GraphPainter(directedGraph1, canvas);
const condensationGraphPainter = new GraphPainter(condensationGraph, canvas);

document.addEventListener('keydown', function(event) {
    //drawBackground();
    if(event.key === '1') {
        console.clear();
        drawBackground();
        directedGraphPainter.draw();
        console.log("Adjacency matrix")
        directedGraph.adjacencyMatrix.print();
        console.log("outDegree : ", directedGraph.outDegree);
        console.log("inDegree : ", directedGraph.inDegree);
        console.log("Regular degree : ", directedGraph.findRegularDegree());
        console.log("Terminated vertexes : ", directedGraph.terminalVertexes);
        console.log("Isolated vertexes : ", directedGraph.isolatedVertexes);

    }
    if(event.key === '2') {
        console.clear();
        drawBackground();
        undirectedGraphPainter.draw();
        console.log("Adjacency matrix")
        undirectedGraph.adjacencyMatrix.print();
        console.log("Vertices degrees : ", undirectedGraph.verticesDegree);
        console.log("Regular degree : ", directedGraph.findRegularDegree());
        console.log("Terminated vertexes : ", directedGraph.terminalVertexes);
        console.log("Isolated vertexes : ", directedGraph.isolatedVertexes);

    }
    if(event.key === '3') {
        console.clear();
        drawBackground();
        directedGraphPainter1.draw();
        console.log("Adjacency matrix");
        directedGraph1.adjacencyMatrix.print();
        console.log("Indegree", directedGraph1.inDegree);
        console.log("Outdegree", directedGraph1.outDegree);
        console.log("Reachability matrix : ")
        directedGraph.reachabilityMatrix.print();
        console.log("Length 2 paths", directedGraph.findAllPaths(2));
        console.log("Length 3 paths", directedGraph.findAllPaths(3));
        console.log("Matrix of strong connectivity : ");
        directedGraph1.matrixOfStrongConnectivity.print();
        console.log("Components of strong connectivity : ");
        console.log(directedGraph1.componentsOfStrongConnectivity);
    }
    if(event.key === '4') {
        console.clear();
        drawBackground();
        condensationGraphPainter.draw();
        console.log("Adjacency matrix : ")
        condensationGraph.adjacencyMatrix.print();

    }

});
