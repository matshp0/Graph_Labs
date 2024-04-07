import utils from "./utils.js"
import config from "./config.js";


class Graph{
    constructor(n) {
        this.numberOfNodes = n;
        this.nodesPosition = [];
        this.createDirectedMatrix();
        this.createUndirectedMatrix();
        utils.printMatrix(this.directedMatrix);
        utils.printMatrix(this.undirectedMatrix);
    }

    createDirectedMatrix(){
        this.directedMatrix = [];
        for (let i = 0; i < this.numberOfNodes; i++){
            const row = [];
            for (let j = 0; j < this.numberOfNodes; j++){
                const value = Math.random() * 2 * config.K;
                if (value >= 1)
                    row.push(1);
                else
                    row.push(0);
            }
            this.directedMatrix.push(row);
        }
    }
    createUndirectedMatrix(){
        this.undirectedMatrix = utils.copyMatrix(this.directedMatrix);
        for (let i = 0; i < this.numberOfNodes; i++){
            for (let j = 0; j < this.numberOfNodes; j++){
                if (this.directedMatrix[i][j])
                    this.undirectedMatrix[j][i] = 1;
            }
        }
    }



}


export { Graph };