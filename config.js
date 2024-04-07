const NODES_NUMBER = 12;
const K = 100//1 - 2 * 0.02 - 5 * 0.005 - 0.25;

const EDGES = 3;
const TOTAL_LENGTH = 2100;
const ANGLE = 180*(EDGES - 2) / EDGES;
const ROTATION_ANGLE = 180 - ANGLE;
const LENGTH = TOTAL_LENGTH / EDGES;
const NODE_RADIUS = 20;
const FONT_SIZE = 20;
const NODE_COLOUR = 'white';
const ARROW_SIZE = 10;

const BACKGROUND_COLOUR = 'black';
const NODE_FILL_STYLE = BACKGROUND_COLOUR;

export default {
    NODES_NUMBER,
    K,
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
    ARROW_SIZE,
}