import { assert } from "chai";
import { Matrix } from "./Matrix.mjs";
import { integersModulo } from "./Field.mjs";
import { generalizedModulo } from "../utils-ts/Math.mjs";

const oppositeParity = (parity: "even" | "odd") => {
	if(parity === "even") { return "odd"; }
	else { return "even"; }
};

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
				predecessors.push(new GraphNode(this.x - 1, y, (this.y - y) % 2 === 0 ? this.parity : oppositeParity(this.parity)));
			}
			else if(y > this.y) {
				predecessors.push(new GraphNode(this.x - 1, y, this.parity));
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

			new GraphNode(1, 3, "odd"),
			new GraphNode(1, 4, "odd"),
			new GraphNode(1, 5, "odd"),
		]);
	});
	it("returns all the predecessors for a node with x>1 and y=0", () => {
		const node = new GraphNode(2, 0, "even");
		assert.sameDeepMembers(node.predecessors(1), [
			new GraphNode(1, 0, "even"),
			new GraphNode(1, 1, "even"),
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
	it("correctly calculates the number of castles in a 3x2 grid, modulo 1000000007", () => {
		assert.equal(castles(3, 2, 1000000007), 6);
	});
	it("correctly calculates the number of castles in a 4x2 grid, modulo 3", () => {
		assert.equal(castles(4, 2, 3), 1);
	});
	it("correctly calculates the number of castles in a 2x3 grid, modulo 1000000007", () => {
		assert.equal(castles(2, 3, 1000000007), 0);
	});
	it("correctly calculates the number of castles in a 3x3 grid, modulo 1000000007", () => {
		assert.equal(castles(3, 3, 1000000007), 3);
	});
	it("correctly calculates the number of castles in a 4x3 grid, modulo 1000000007", () => {
		assert.equal(castles(4, 3, 1000000007), 21);
	});
	it("correctly calculates the number of castles in a 4x3 grid, modulo 11", () => {
		assert.equal(castles(4, 3, 11), 10);
	});

	/* test cases provided by Project Euler (i.e. not calculated by me) */
	it("correctly calculates the number of castles in a 4x2 grid, modulo 1000000007", () => {
		assert.equal(castles(4, 2, 1000000007), 10);
	});
	// it("correctly calculates the number of castles in a 13x10 grid, modulo 73338856117409", () => {
	// 	assert.equal(castles(13, 10, 73338856117409), 3729050610636);
	// });
	// it("correctly calculates the number of castles in a 10x13 grid, modulo 73338856117409", () => {
	// 	assert.equal(castles(10, 13, 73338856117409), 37959702514);
	// });
});

export const solve = () => {
	const MODULO = 1000000007;
	return (castles(10 ** 12, 100, MODULO) + castles(10000, 10000, MODULO) + castles(100, 10 ** 12, MODULO)) % MODULO;
};
