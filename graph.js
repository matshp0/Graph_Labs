import utils from "./utils.js"
import config from "./config.js";
import { Matrix } from "./Matrix.js";


class Graph{
    constructor(matrix, directed) {
        this.adjacencyMatrix =  Matrix.fromArray(matrix);
        this.directed = directed;
        this.numberOfNodes = matrix.length;
        if (!this.directed)
            this.generateUndirectedMatrix()
        this.calculateVerticesDegree();
        if (this.directed){
            this.findInOutDegree();
            this.calculateReachabilityMatrix();
            this.calculateStrongConnectivity();
            this.calculateComponentsOfStrongConnectivity();
        }
        this.findTerminalAndIsolatedVertexes();
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

    findPaths(paths, vertex, path, currentLengthOfPath, length){
        if (currentLengthOfPath >= length) {
            paths.push([...path]);
            return;
        }

        for (let nextVertex = 0; nextVertex < this.numberOfNodes; nextVertex++) {
            if (this.adjacencyMatrix[vertex][nextVertex]) {
                path.push(nextVertex + 1);
                this.findPaths(paths, nextVertex, path, currentLengthOfPath + 1, length);
                path.pop();
            }
        }
    }

    findAllPaths(length){
        const allPaths = [];
        const result = [];

        for (let vertex = 0; vertex < this.numberOfNodes; vertex++) {
            const path = [vertex + 1];
            this.findPaths(allPaths, vertex, path, 0, length);
        }

        for (const path of allPaths){
            const a = [];
            let f = true;
            for (let i = 0; i < path.length - 1; i++){
                const couple =  JSON.stringify([path[i], path[i + 1]])
                if (a.includes(couple)){
                    f = false;
                    break;
                }
                a.push(couple);
            }
            if (f) result.push(path);
        }
        return result;
    }

    getCondensationGraph(){
        const matrix = this.componentsOfStrongConnectivity;
        const n = matrix.length;
        const condensationMatrix = new Matrix(n)
        for (let i = 0; i < n; i++){
            for (let j = i + 1; j < n; j++){
                const component1 = matrix[i];
                const component2 = matrix[j];
                for (let i1 = 0; i1 < component1.length; i1++){
                    for (let j1 = 0; j1 < component2.length; j1++){
                        if (this.adjacencyMatrix[component1[i1] - 1][component2[j1] - 1])
                            condensationMatrix[i][j] = 1;
                        if (this.adjacencyMatrix[component2[j1] - 1][component1[i1] - 1])
                            condensationMatrix[j][i] = 1;
                    }
                }
            }
        }
        return new Graph(condensationMatrix, 1);

    }

}


export { Graph };