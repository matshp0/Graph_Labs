import utils from "./utils.js";
import config from "./config.js";

class Matrix extends Array {
    constructor(n) {
        super(n);
        this.n = n;
        for (let i = 0; i < n; i++) {
            this[i] = new Array(n).fill(0);
        }
    }

    static fromArray(array) {
        const n = array.length;
        const matrix = new Matrix(n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                matrix[i][j] = array[i][j];
            }
        }
        matrix.n  = n;
        return matrix;
    }

    static isEqual(matrix1, matrix2){
        for(let i = 0; i < matrix1.length; i++) {
            if(matrix1[i]!== matrix2[i]) return false;
        }
        return true;
    }

    static identity(n){
        const result = new Matrix(n);
        for (let i = 0; i < n; i++){
            result[i][i] = 1;
        }
        return result;
    }

    static copy(matrix){
        return Matrix.fromArray(matrix);
    }

    static sum(matrices){
        const result = new Matrix(matrices[0].length);
        for (let i1 = 0; i1 < matrices.length; i1++){
            for (let i = 0; i < result.n; i++){
                for (let j = 0; j < result.n; j++){
                    result[i][j] = result[i][j] +  matrices[i1][i][j];
                }
            }
        }
        return result;
    }

    static hadamardProduct(matrix1, matrix2){
        const result = new Matrix(matrix1.length);
        for (let i = 0; i < result.n; i++){
            for (let j = 0; j < result.n; j++){
                result[i][j] = matrix1[i][j] * matrix2[i][j];
            }
        }
        return result;
    }

    transpose(){
        const result =  new Matrix(this.n)
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++){
                result[i][j] += this[j][i];
            }
        }
        return result;
    }

    bool(){
        const result =  new Matrix(this.n)
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++){
                result[i][j] = +!!this[i][j];
            }
        }
        return result;

    }


    randomFill(k){
        const random = utils.seededRandom(config.SEED);
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++){
                this[i][j] = random() * k;
            }
        }
    }

    static upperTriangular(n){
        const result = new Matrix(n);
        for (let i = 0; i < n; i++){
            for (let j = i + 1; j < n; j++){
                result[i][j] = 1;
            }
        }
        return result;
    }

    static multiply(matrix, k) {
        const result = Matrix.fromArray(matrix);
        for (let i = 0; i < matrix.n; i++){
            for (let j = 0; j < matrix.n; j++){
                result[i][j] *= k;
            }
        }
        return result;
    }

    static pow(matrix, power){
        if (!power) return Matrix.identity(matrix.n);
        let result = matrix;
        for (let i = 0; i < power - 1; i++){
            result = Matrix.multiply(matrix, result);
        }
        return result;
    }

    map(callback){
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j < this.n; j++){
                this[i][j] = callback(this[i][j]);
            }
        }

    }

    reflect(){
        for (let i = 0; i < this.n; i++){
            for (let j = i; j < this.n; j++){
                this[j][i] = this[i][j]
            }
        }
    }

    print() {
        console.log('------------------------------------');
        for (let i = 0; i < this.length; i++) {
            console.log(this[i].join("\t"));
        }
        console.log('------------------------------------');
    }



}

export { Matrix }