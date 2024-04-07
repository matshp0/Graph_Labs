import { Graph } from './graph.js';
import { GraphPainter } from "./GraphPainter.js";
import config from "./config.js";



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

let f = false;
const graph = new Graph(config.NODES_NUMBER);
const graphPainter = new GraphPainter(graph, canvas);
graphPainter.drawUndirectedGraph(f);

document.addEventListener('keydown', function(event) {
    drawBackground();
    if (f) {
        //graphPainter.drawLoop(0);
        graphPainter.drawUndirectedGraph(f);
    }
    else
        graphPainter.drawDirectedGraph(f);

    f = !f;
});
