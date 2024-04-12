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
                    result[i][j] = parseInt(result[i][j]) +  parseInt(matrices[i1][i][j]);
                }
            }
        }
        return result;
    }

    static hadamardProduct(matrix1, matrix2){
        const result = new Matrix(matrix1.length);
        for (let i = 0; i < result.n; i++){
            for (let j = 0; j < result.n; j++){
                result[i][j] = parseInt(matrix1[i][j]) * parseInt(matrix2[i][j]);
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
                const value =  random() * 2 * k;
                if (value >= 1) {
                    this[i][j] = 1;
                }
                else
                    this[i][j] = 0;
            }
        }
    }

    static multiply(matrix1, matrix2) {
        if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
            throw new Error('Matrices must be of the same size for multiplication');
        }

        const result = new Matrix(matrix1.length);
        for (let i = 0; i < matrix1.length; i++) {
            for (let j = 0; j < matrix1[i].length; j++) {
                result[i][j] = 0;
                for (let k = 0; k < matrix1.length; k++) {
                    result[i][j] += matrix1[i][k] * matrix2[k][j];
                }
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

    print() {
        console.log('------------------------------------');
        for (let i = 0; i < this.length; i++) {
            console.log(this[i].join("\t"));
        }
        console.log('------------------------------------');
    }

    sumUp(){
        let sum = 0;
        for (let i = 0; i < this.n; i++){
            for (let j = 0; j< this.n; j++){
                sum += this[i][j];
            }
        }
        return sum;
    }


}

export { Matrix }