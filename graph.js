import utils from "./utils.js"
import config from "./config.js";
import { Matrix } from "./Matrix.js";


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
        const size = A.n;
        const B = new Matrix(size);
        B.randomFill(2);
        const C = Matrix.multiply(Matrix.hadamardProduct(A, B), 100);
        const H = new Matrix(size);
        for (let i = 0; i < size; i++){
            for (let j = 0; j < size; j++){
                if (A[i][j] !== A[j][i])
                    H[i][j] = 1;
            }
        }
        H.print();
        const Tr = Matrix.upperTriangular(size);
        Tr.print();
        const sum = Matrix.sum([A, Matrix.hadamardProduct(H, Tr)]);
        const product = Matrix.hadamardProduct(sum, C);
        const result = new Graph(product, false);
        result.weighted = true;
        product.print();
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

    calculateVerticesDegree(){
        this.verticesDegree = [];
        for (const row of this.adjacencyMatrix) {
            let degree = 0;
            for (let i = 0; i < this.numberOfNodes; i++) {
                if (row[i]) degree++;
            }
            this.verticesDegree.push(degree);
        }
    }

    findRegularDegree(){
        if (!this.directed) {
            for (let i = 0; i < this.verticesDegree.length; i++) {
                if (this.verticesDegree[i] !== this.verticesDegree[0])
                    return -1;
            }
            return this.verticesDegree[0];
        }
        const matrix = [...this.inDegree, ...this.outDegree];
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i] !== matrix[0])
                return -1;
        }
        return matrix[0];

    }

    findInOutDegree(){
        if (!this.directed) throw new Error("Graph must be directed");
        this.inDegree = [];
        this.outDegree = this.verticesDegree;
        for (let i = 0; i < this.numberOfNodes; i++) {
            let degree = 0;
            for (let j = 0; j < this.numberOfNodes; j++) {
                if (this.adjacencyMatrix[j][i]) degree++;
            }
            this.inDegree.push(degree);

        }
    }
    findTerminalAndIsolatedVertexes(){
        this.isolatedVertexes = [];
        this.terminalVertexes = [];
        if (this.directed) {
            for (let  i = 0; i < this.numberOfNodes; i++){
                if (this.inDegree[i] === 1 && this.outDegree[i] === 0) {
                    this.terminalVertexes.push(i + 1);
                }
                if (this.inDegree[i] + this.outDegree[i] === 0)
                    this.isolatedVertexes.push(i + 1)
            }
            return;
        }
        for (let  i = 0; i < this.numberOfNodes; i++){
            if (this.verticesDegree[i] === 1)
                this.terminalVertexes.push(i + 1);
            if (!this.verticesDegree[i])
                this.isolatedVertexes.push(i + 1);
        }
    }

    calculateReachabilityMatrix(){
        const poweredMatrices = [];
        for (let i = 0; i < this.numberOfNodes; i++){
            poweredMatrices.push(Matrix.pow(this.adjacencyMatrix, i));
        }
        this.reachabilityMatrix = Matrix.sum(poweredMatrices).bool();
    }

    calculateStrongConnectivity(){
        const transposed = this.reachabilityMatrix.transpose();
        this.matrixOfStrongConnectivity = Matrix.hadamardProduct(transposed, this.reachabilityMatrix);
    }

    calculateComponentsOfStrongConnectivity(){
        const components = [];

        for(let row = 0; row < this.matrixOfStrongConnectivity.length; row++) {
            let f = -1;
            for(let i = 0; i < components.length; i++) {
                if(Matrix.isEqual(components[i].component, this.matrixOfStrongConnectivity[row])) {
                    f = i;
                }
            }
            if(f >= 0) components[f].rows.push(row + 1);
            else(components.push({
                component: this.matrixOfStrongConnectivity[row],
                rows: [row + 1],
            }))
        }

        this.componentsOfStrongConnectivity = [];
        for(const component of components) {
            this.componentsOfStrongConnectivity.push(component.rows);
        }

    }





}


export { Graph };