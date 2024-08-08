import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { MATRIX_DATA } from "../81-path-sum-two-ways/matrix-data.mjs";
import { TEST_MATRIX_DATA } from "../81-path-sum-two-ways/test-matrix-data.mjs";

const MATRIX = new Matrix(80, 80, Field.REALS, MATRIX_DATA);
// const MATRIX = new Matrix(5, 5, Field.REALS, TEST_MATRIX_DATA);


type NodeInfo = { value: number, visited: boolean };

const initializeNodes = () => {
	const nodes: NodeInfo[][] = [];
	for(let row = 0; row < MATRIX.height; row ++) {
		nodes[row] = [];
		for(let column = 0; column < MATRIX.width; column ++) {
			nodes[row][column] = {
				value: Infinity,
				visited: false
			};
		}
	}
	return nodes;
};
const nextNodePosition = (nodes: NodeInfo[][]): [number, number] => {
	let minRow = 0;
	let minColumn = 0;
	let minNode: NodeInfo | null = null;
	for(let row = 0; row < MATRIX.width; row ++) {
		for(let column = 0; column < MATRIX.height; column ++) {
			const node = nodes[row][column];
			if(!node.visited && (!minNode || node.value < minNode.value)) {
				minRow = row;
				minColumn = column;
				minNode = nodes[row][column];
			}
		}
	}
	return [minRow, minColumn];
};
const neighbors = (row: number, column: number) => {
	return [
		[row - 1, column],
		[row + 1, column],
		[row, column - 1],
		[row, column + 1]
	].filter(([r, c]) => 0 <= r && r < MATRIX.width && 0 <= c && c < MATRIX.height);
};
const propagate = (nodes: NodeInfo[][], row: number, column: number) => {
	const node = nodes[row][column];
	node.visited = true;
	for(const [neighborRow, neighborColumn] of neighbors(row, column)) {
		const neighbor = nodes[neighborRow][neighborColumn];
		neighbor.value = Math.min(neighbor.value, node.value + MATRIX.get(neighborRow, neighborColumn));
	}
};
const pathSum = () => {
	const nodes = initializeNodes();
	nodes[0][0].value = MATRIX.get(0, 0);
	for(let i = 0; i < MATRIX.width * MATRIX.height; i ++) {
		propagate(nodes, ...nextNodePosition(nodes));
	}
	return nodes[MATRIX.height - 1][MATRIX.width - 1].value;
};
// console.log(pathSum());
// debugger;
