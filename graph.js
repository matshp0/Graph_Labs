import utils from "./utils.js"
import config from "./config.js";
import { Matrix } from "./Matrix.js";
import Queue from "./Queue.js";


class Graph{
    constructor(matrix, directed) {
        this.weighted = false;
        this.adjacencyMatrix =  Matrix.fromArray(matrix);
        this.directed = directed;
        this.numberOfNodes = matrix.length;
        if (!this.directed)
            this.generateUndirectedMatrix()
    }

    static createWeightedGraph(A){
        const random1 = utils.seededRandom(config.SEED - 1);
        const size = A.n;
        const B = new Matrix(size);
        const result = new Graph(A, 0);
        result.generateUndirectedMatrix();
        for (let i = 0; i < size; i++){
            for (let j = 0; j < size; j++){
                result.adjacencyMatrix[i][j] *= (random1() * 200).toFixed(0);
            }
        }
        B.randomFill(200);
        const C = Matrix.multiply(Matrix.hadamardProduct(A, B), 100);
        const H = new Matrix(size);
        const Tr = Matrix.upperTriangular(size);
        const sum = Matrix.sum([A, Matrix.hadamardProduct(H, Tr)]);
        const product = Matrix.hadamardProduct(sum, C);
        result.weighted = true;
        result.adjacencyMatrix.reflect();
        result.adjacencyMatrix.print();
        return result;


    }

    generateUndirectedMatrix(){
        for (let i = 0; i < this.numberOfNodes; i++){
            for (let j = 0; j < this.numberOfNodes; j++){
                if (this.adjacencyMatrix[i][j])
                    this.adjacencyMatrix[j][i] = 1;
            }
        }
    }
    primMST(graph) {
        const n = graph.length;
        const parent = new Array(n);
        const key = new Array(n);
        const mstSet = new Array(n);
        for (let i = 0; i < n; i++) {
            key[i] = Infinity;
            mstSet[i] = false;
        }
        key[0] = 0;
        parent[0] = -1;
        const queue = new Queue();
        for (let count = 0; count < n; count++) {
            const u = this.minKey(key, mstSet);
            mstSet[u] = true;
            if (parent[u] !== undefined)
                queue.enqueue([parent[u] + 1, u + 1 ]);
            for (let v = 0; v < n; v++) {
                if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                    parent[v] = u;
                    key[v] = graph[u][v];
                }
            }
        }
        return queue;
    }


    minKey(key, mstSet) {
        let min = Infinity,
            minIndex;
        for (let v = 0; v < key.length; v++) {
            if (mstSet[v] === false && key[v] < min) {
                min = key[v];
                minIndex = v;
            }
        }
        return minIndex;
    }

}


export { Graph };