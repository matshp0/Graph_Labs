const NODES_NUMBER = 12;
const K1 = 1 - 2 * 0.01 - 5 * 0.005 - 0.05;
const K = 0.61;
const SEED = 333;

const EDGES = 3;
const TOTAL_LENGTH = 2000;
const ANGLE = 180*(EDGES - 2) / EDGES;
const ROTATION_ANGLE = 180 - ANGLE;
const LENGTH = TOTAL_LENGTH / EDGES;
const NODE_RADIUS = 20;
const FONT_SIZE = 20;
const NODE_COLOUR = 'white';
const ARROW_COLOUR = 'white';
const ARROW_SIZE = 0;
const DFS_COLOUR = 'red';

const WEIGHT_FONT = "15px Arial";
const BACKGROUND_COLOUR = 'black';
const NODE_FILL_STYLE = BACKGROUND_COLOUR;
const WEIGHTS_COLOUR = 'red'

export default {
    NODES_NUMBER,
    SEED,
    DFS_COLOUR,
    K,
    K1,
    EDGES,
    TOTAL_LENGTH,
    ANGLE,
    ROTATION_ANGLE,
    LENGTH,
    NODE_RADIUS,
    FONT_SIZE,
    NODE_COLOUR,
    BACKGROUND_COLOUR,
    NODE_FILL_STYLE,
    ARROW_COLOUR,
    ARROW_SIZE,
    WEIGHTS_COLOUR,
    WEIGHT_FONT,
}