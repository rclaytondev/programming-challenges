import { assert } from "chai";
import { Matrix } from "./Matrix";
import { integersModulo } from "./Field";
import { generalizedModulo } from "../utils-ts/Math";

class GraphNode {
	x: number;
	y: number;
	parity: "even" | "odd";

	constructor(x: number, y: number, parity: "even" | "odd") {
		this.x = x;
		this.y = y;
		this.parity = parity;
	}

	predecessors(height: number) {
		if(this.x === 0) { return []; }
		if(this.x === 1) {
			return ((this.y % 2 === 0) === (this.parity === "even")) ? [new GraphNode(0, 0, "even")] : [];
		}
		const predecessors = [];
		for(let y = 0; y <= height; y ++) {
			if(y <= this.y) {
				predecessors.push(new GraphNode(this.x - 1, y, (1 - ((this.y - y) % 2)) === 0 ? "even" : "odd"));
			}
			else if(y > this.y) {
				predecessors.push(new GraphNode(this.x - 1, y, "even"));
				predecessors.push(new GraphNode(this.x - 1, y, "odd"));
			}
		}
		return predecessors;
	}
	toString() {
		return `${this.x},${this.y},${this.parity}`;
	}
}

const initializeGraph = (width: number, height: number): [GraphNode[], Map<string, number>] => {
	const nodes: GraphNode[] = [new GraphNode(0, 0, "even")];
	const reverseNodeMap: Map<string, number> = new Map([["0,0,even", 0]]);
	for(let x = 1; x <= width; x ++) {
		for(let y = 0; y <= height; y ++) {
			nodes.push(new GraphNode(x, y, "even"));
			reverseNodeMap.set(`${x},${y},even`, nodes.length - 1);
			nodes.push(new GraphNode(x, y, "odd"));
			reverseNodeMap.set(`${x},${y},odd`, nodes.length - 1);
		}
	}
	nodes.push(new GraphNode(width + 1, 0, "odd"));
	reverseNodeMap.set(`${width + 1},0,odd`, nodes.length - 1);
	return [nodes, reverseNodeMap];
};
const getAdjacencyMatrix = (nodes: GraphNode[], reverseNodeMap: Map<string, number>, height: number, modulo: number) : Matrix<number> => {
	/* Returns the matrix where the entry in the ith row and the jth column is the number of paths from node i to node j. */
	const field = integersModulo(modulo);
	const matrix = new Matrix(nodes.length, nodes.length, field);
	for(const node of nodes) {
		const nodeIndex = reverseNodeMap.get(node.toString())!;
		for(const predecessor of node.predecessors(height)) {
			const predecessorIndex = reverseNodeMap.get(predecessor.toString())!;
			matrix.set(predecessorIndex, nodeIndex, 1);
		}
	}
	return matrix;
};

const nonFullHeightOddCastlesWithoutBase = (width: number, height: number, modulo: number): number => {
	const [nodes, reverseNodeMap] = initializeGraph(width, height);
	const adjacencyMatrix = getAdjacencyMatrix(nodes, reverseNodeMap, height, modulo);
	const sumOfPowers = Matrix.identity(adjacencyMatrix.field, adjacencyMatrix.width).subtract(adjacencyMatrix).inverse();
	return sumOfPowers!.get(
		reverseNodeMap.get("0,0,even")!,
		reverseNodeMap.get(`${width + 1},0,odd`)!,
	);
};
const castles = (width: number, height: number, modulo: number) => {
	const result = nonFullHeightOddCastlesWithoutBase(width, height - 1, modulo) - nonFullHeightOddCastlesWithoutBase(width, height - 2, modulo);
	return generalizedModulo(result, modulo);
};


describe("GraphNode.predecessors", () => {
	it("returns an empty list for an x=1 node where the parity does not match the parity of the y-value", () => {
		const node = new GraphNode(1, 3, "even");
		assert.sameDeepOrderedMembers(node.predecessors(3), []);
	});
	it("returns a list containing the (0, 0, even) node for an x=1 node when the parity matches the parity of the y-value", () => {
		const node = new GraphNode(1, 3, "odd");
		assert.sameDeepOrderedMembers(node.predecessors(3), [new GraphNode(0, 0, "even")]);
	});
	it("returns the empty list for an x=0 node", () => {
		const node = new GraphNode(0, 2, "even");
		assert.sameDeepOrderedMembers(node.predecessors(3), []);
	});
	it("returns all the predecessors for a node with x>1", () => {
		const node = new GraphNode(2, 2, "odd");
		assert.sameDeepMembers(node.predecessors(5), [
			new GraphNode(1, 0, "odd"),
			new GraphNode(1, 1, "even"),
			new GraphNode(1, 2, "odd"),

			new GraphNode(1, 3, "even"),
			new GraphNode(1, 3, "odd"),
			new GraphNode(1, 4, "even"),
			new GraphNode(1, 4, "odd"),
			new GraphNode(1, 5, "even"),
			new GraphNode(1, 5, "odd"),
		]);
	});
});
describe("castles", () => {
	it("correctly calculates the number of castles in a 1x2 grid, modulo 1000000007", () => {
		assert.equal(castles(1, 2, 1000000007), 1);
	});
	it("correctly calculates the number of castles in a 2x2 grid, modulo 1000000007", () => {
		assert.equal(castles(2, 2, 1000000007), 3);
	});

	/* test cases provided by Project Euler (i.e. not calculated by me) */
	it("correctly calculates the number of castles in a 4x2 grid, modulo 1000000007", () => {
		assert.equal(castles(4, 2, 1000000007), 10);
	});
});
