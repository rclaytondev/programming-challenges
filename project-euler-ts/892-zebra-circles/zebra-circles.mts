import { assert } from "chai";
import { describe } from "mocha";
import { Tree } from "../utils-ts/Tree.mjs";

const MODULO = 1234567891;

const iterateCyclically = function*<T>(items: T[], startValue: T) {
	const startIndex = items.indexOf(startValue);
	if(startIndex === -1) {
		throw new Error(`Did not find ${startValue} in array ${items}.`);
	}
	for(let i = startIndex; i < items.length; i ++) {
		yield items[i];
	}
	for(let i = 0; i < startIndex; i ++) {
		yield items[i];
	}
};

abstract class Edge {
	abstract type: "line" | "arc";
	vertex1: number;
	vertex2: number;
	constructor(vertex1: number, vertex2: number) {
		this.vertex1 = vertex1;
		this.vertex2 = vertex2;
	}

	hasVertex(vertex: number)  {
		return this.vertex1 === vertex || this.vertex2 === vertex;
	}
	passesVertex(vertex: number) {
		return (
			(this.vertex1 < vertex && vertex < this.vertex2) ||
			(this.vertex1 > this.vertex2 && (vertex > this.vertex1 || vertex < this.vertex2))
		);
	}
	passedVertices(numPoints: number) {
		const result = [];
		if(this.vertex1 < this.vertex2) {
			for(let i = this.vertex1 + 1; i < this.vertex2; i ++) {
				result.push(i);
			}
		}
		else {
			for(let i = this.vertex1 + 1; i <= numPoints; i ++) {
				result.push(i);
			}
			for(let i = 1; i < this.vertex2; i ++) {
				result.push(i);
			}
		}
		return result;
	}
	abstract edgeOfSameType(vertex1: number, vertex2: number): Edge;
}
class LineEdge extends Edge {
	type: "line" = "line";
	edgeOfSameType(vertex1: number, vertex2: number) {
		return new  LineEdge(vertex1, vertex2);
	}

	toString() {
		return `${Math.min(this.vertex1, this.vertex2)},${Math.max(this.vertex1, this.vertex2)}`;
	}
};
class ArcEdge extends Edge {
	type: "arc" = "arc";
	edgeOfSameType(vertex1: number, vertex2: number) {
		return new  ArcEdge(vertex1, vertex2);
	}
};

class Region {
	edges: Edge[] = [];

	constructor(edges: Edge[]) {
		this.edges = edges;
	}

	cut(edge: LineEdge): [Region, Region] {
		const regions = [];
		for(const [startVertex, endVertex] of [[edge.vertex1, edge.vertex2], [edge.vertex2, edge.vertex1]] as const) {
			const startingEdge2 = this.edges.find(e => e.passesVertex(startVertex));
			if(!startingEdge2) { throw new Error(`Did not find an edge passing vertex ${startVertex}`); }
			const edges = [startingEdge2.edgeOfSameType(startVertex, startingEdge2.vertex2)];
			for(const edge of [...iterateCyclically(this.edges, startingEdge2)].slice(1)) {
				if(edge.passesVertex(endVertex)) {
					edges.push(edge.edgeOfSameType(edge.vertex1, endVertex));
					break;
				}
				edges.push(edge);
			}
			edges.push(new LineEdge(endVertex, startVertex));
			regions.push(new Region(edges));
		}
		return regions as [Region, Region];
	}
	unusedVertices(numPoints: number) {
		let vertices: number[] = [];
		for(const edge of this.edges.filter(e => e instanceof ArcEdge)) {
			vertices = [...vertices, ...edge.passedVertices(numPoints)];
		}
		return vertices;
	}
}

class PartialCutting {
	numPoints: number;
	edges: LineEdge[];
	regions: Region[];

	constructor(numPoints: number, edges: LineEdge[] = [], regions: Region[] = [new Region([new ArcEdge(1, numPoints)])]) {
		this.numPoints = numPoints;
		this.edges = edges;
		this.regions = regions;
	}

	*getChildren() {
		if(this.edges.length === 0) {
			for(let vertex = 2; vertex <= this.numPoints; vertex += 2) {
				yield new PartialCutting(
					this.numPoints,
					[new LineEdge(1, vertex)],
					[
						new Region([
							new ArcEdge(1, vertex),
							new LineEdge(vertex, 1)
						]),
						new Region([
							new LineEdge(1, vertex),
							new ArcEdge(vertex, 1)
						])
					]
				)
			}
		}
		else {
			const firstUnusedVertex = this.firstUnusedVertex();
			if(!firstUnusedVertex) { return; }
			const region = this.regions.find(r => r.unusedVertices(this.numPoints).includes(firstUnusedVertex));
			if(!region) {
				throw new Error(`Did not find region containing vertex ${firstUnusedVertex}.`);
			}
			for(const otherVertex of region.unusedVertices(this.numPoints).filter(v => v !== firstUnusedVertex)) {
				if((firstUnusedVertex - otherVertex) % 2 !== 0) {
					yield this.connect(firstUnusedVertex, otherVertex, region);
				}
			}
		}
	}
	firstUnusedVertex() {
		for(let i = 1; i <= this.numPoints; i ++) {
			if(!this.edges.some(e => e.hasVertex(i))) {
				return i;
			}
		}
		return null;
	}
	connect(vertex1: number, vertex2: number, containingRegion: Region) {
		const newEdge = new LineEdge(vertex1, vertex2);
		return new PartialCutting(
			this.numPoints,
			[...this.edges, newEdge],
			[...this.regions.filter(r => r !== containingRegion), ...containingRegion.cut(newEdge)]
		);
	}
	adjacentRegions(region: Region) {
		const edges = new Set(region.edges.filter(e => e instanceof LineEdge).map(e => (e as LineEdge).toString()));
		return this.regions.filter(r => r !== region && r.edges.some(e => e instanceof LineEdge && edges.has(e.toString())));
	}
	coloringDifference() {
		let numWhite = 0;
		let numBlack = 0;
		let visitedRegions = new Set<Region>();
		for(const { node, ancestors } of Tree.nodesAndAncestors(
			this.regions[0], 
			(region) => this.adjacentRegions(region).filter(r => !visitedRegions.has(r)))
		) {
			visitedRegions.add(node);
			if(ancestors.length % 2 === 0) {
				numWhite ++;
			}
			else {
				numBlack ++;
			}
		}
		return Math.abs(numWhite - numBlack);
	}
}
const allCuttings = function*(numPoints: number) {
	const EMPTY_CUTTING = new PartialCutting(numPoints);
	for(const cutting of Tree.leaves(EMPTY_CUTTING, c => c.getChildren())) {
		if(cutting.edges.length * 2 === numPoints) {
			yield cutting;
		}
	}
};
const coloringDifferenceSum = (numPoints: number) => {
	let sum = 0;
	for(const cutting of allCuttings(numPoints)) {
		sum += cutting.coloringDifference();
	}
	return sum;
};

describe("allCuttings", () => {
	it("returns the correct number of cuttings for 2 points", () => {
		const cuttings = [...allCuttings(2)];
		assert.lengthOf(cuttings, 1);
	});
	it("returns the correct number of cuttings for 4 points", () => {
		const cuttings = [...allCuttings(4)];
		assert.lengthOf(cuttings, 2);
	});
	it("returns the correct number of cuttings for 6 points", () => {
		const cuttings = [...allCuttings(6)];
		assert.lengthOf(cuttings, 5);
	});
});
describe("Region.cut", () => {
	it("cuts the region along the given line segment, returning the resulting two smaller regions", () => {
		const region = new Region([
			new LineEdge(1, 5),
			new ArcEdge(5, 8),
			new LineEdge(8, 12),
			new ArcEdge(12, 1),
		]);
		const subregions = region.cut(new LineEdge(6, 15));
		const subregion1 = subregions.find(s => s.edges.some(e => e.hasVertex(8)));
		const subregion2 = subregions.find(s => s !== subregion1);
		assert.deepEqual(subregion1, new Region([
			new ArcEdge(6, 8),
			new LineEdge(8, 12),
			new ArcEdge(12, 15),
			new LineEdge(15, 6)
		]));
		assert.deepEqual(subregion2, new Region([
			new ArcEdge(15, 1),
			new LineEdge(1, 5),
			new ArcEdge(5, 6),
			new LineEdge(6, 15)
		]));
	});
});
describe("coloringDifferenceSum", () => {
	// it("returns the correct answer for the input of 100 from Project Euler", () => {
	// 	const sum = coloringDifferenceSum(100);
	// 	assert.equal(sum % MODULO, 1172122931);
	// });
});
