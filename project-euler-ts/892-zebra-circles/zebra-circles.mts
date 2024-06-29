import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { Tree } from "../../utils-ts/modules/math/Tree.mjs";

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

export class Edge {
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

	reverse() {
		return new Edge(this.vertex2, this.vertex1);
	}

	static areClockwise(vertex1: number, vertex2: number, vertex3: number) {
		/* Returns whether vertex1, vertex2, and vertex3 are arranged clockwise (in that order) around the circle. */
		return (
			(vertex1 < vertex2 && vertex2 < vertex3) ||
			(vertex3 < vertex1 && vertex1 < vertex2) ||
			(vertex2 < vertex3 && vertex3 < vertex1)
		)
	}

	toString() {
		return `(${this.vertex1},${this.vertex2})`;
	}
}

export class Region {
	edges: Edge[] = []; // must be going clockwise starting from some point

	constructor(edges: Edge[]) {
		this.edges = edges;
	}

	cut(edge: Edge): [Region, Region] {
		const regions = [];
		return [
			new Region([
				edge, 
				...this.edges.filter(e => Edge.areClockwise(edge.vertex1, e.vertex1, edge.vertex2))
			]),
			new Region([
				edge.reverse(), 
				...this.edges.filter(e => !Edge.areClockwise(edge.vertex1, e.vertex1, edge.vertex2))
			])
		];
	}
	unusedVertices(numPoints: number) {
		const usedVertices = new Set(this.edges.map(e => e.passedVertices(numPoints)).flat(1));
		return Utils.range(1, numPoints, "inclusive", "inclusive").filter(v => !usedVertices.has(v));
	}
}

export class PartialCutting {
	numPoints: number;
	edges: Edge[];
	regions: Region[];

	constructor(numPoints: number, edges: Edge[] = [], regions: Region[] = [new Region([])]) {
		this.numPoints = numPoints;
		this.edges = edges;
		this.regions = regions;
	}

	*getChildren() {
		if(this.edges.length === 0) {
			for(let vertex = 2; vertex <= this.numPoints; vertex += 2) {
				yield new PartialCutting(
					this.numPoints,
					[new Edge(1, vertex)],
					[
						new Region([new Edge(1, vertex)]),
						new Region([new Edge(vertex, 1)])
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
		const newEdge = new Edge(vertex1, vertex2);
		return new PartialCutting(
			this.numPoints,
			[...this.edges, newEdge],
			[...this.regions.filter(r => r !== containingRegion), ...containingRegion.cut(newEdge)]
		);
	}
	adjacentRegions(region: Region) {
		const edges = new Set(region.edges.map(e => e.toString()));
		return this.regions.filter(r => r !== region && r.edges.some(e => edges.has(e.toString())));
	}
	getColoring() {
		let visitedRegions = new Set<Region>();
		const coloredRegions: [Region, "white" | "black"][] = [];
		for(const { node, ancestors } of Tree.nodesAndAncestors(
			this.regions[0], 
			(region) => this.adjacentRegions(region).filter(r => !visitedRegions.has(r)))
		) {
			visitedRegions.add(node);
			if(ancestors.length % 2 === 0) {
				coloredRegions.push([node, "white"]);
			}
			else {
				coloredRegions.push([node, "black"]);
			}
		}
		return coloredRegions;
	}
	coloringDifference() {
		const coloring = this.getColoring();
		const numWhite = coloring.filter(([region, color]) => color === "white").length;
		const numBlack = coloring.filter(([region, color]) => color === "black").length;
		return Math.abs(numWhite - numBlack);
	}

	// equals(cutting: PartialCutting) {

	// }
}
export const allCuttings = function*(numPoints: number) {
	const EMPTY_CUTTING = new PartialCutting(numPoints);
	for(const cutting of Tree.leaves(EMPTY_CUTTING, c => c.getChildren())) {
		if(cutting.edges.length * 2 === numPoints) {
			yield cutting;
		}
	}
};
export const coloringDifferenceSum = (numPoints: number) => {
	let sum = 0;
	for(const cutting of allCuttings(numPoints)) {
		sum += cutting.coloringDifference();
	}
	return sum;
};

export const cuttingsWithColoringDifference = (numPoints: number, coloringDifference: number) => {
	let num = 0;
	for(const cutting of allCuttings(numPoints)) {
		if(cutting.coloringDifference() === coloringDifference) {
			num ++;
		}
	}
	return num;
};
