import { assert } from "chai";
import { describe } from "mocha";

class NumberTriangle {
	rows: number[][];
	constructor(rows: number[][]) {
		this.rows = rows;
	}

	leftSubtriangle() {
		return new NumberTriangle(this.rows.slice(1).map(arr => arr.slice(0, arr.length - 1)));
	}
	rightSubtriangle() {
		return new NumberTriangle(this.rows.slice(1).map(arr => arr.slice(1)));
	}
	subtriangle(whichSide: "L" | "R") {
		return (whichSide === "L") ? this.leftSubtriangle() : this.rightSubtriangle();
	}

	solve(target: number): ("L" | "R")[] | null {
		if(this.rows.length === 1) {
			return this.rows[0][0] === target ? [] : null;
		}
		for(const whichSide of ["L", "R"] as const) {
			const solution = this.subtriangle(whichSide).solve(target / this.rows[0][0]);
			if(solution !== null) {
				return [whichSide, ...solution];
			}
		}
		return null;
	}
}

const AOPS_SMALL_EXAMPLE = new NumberTriangle([
	[1],
	[2, 3],
	[4, 1, 1]
]);

describe("NumberTriangle.leftSubtriangle", () => {
	it("returns the subtriangle starting with the item to the left of the topmost item", () => {
		const triangle = AOPS_SMALL_EXAMPLE.leftSubtriangle();
		assert.deepEqual(triangle, new NumberTriangle([
			[2],
			[4, 1]
		]));
	});
});
describe("NumberTriangle.rightSubtriangle", () => {
	it("returns the subtriangle starting with the item to the right of the topmost item", () => {
		const triangle = AOPS_SMALL_EXAMPLE.rightSubtriangle();
		assert.deepEqual(triangle, new NumberTriangle([
			[3],
			[1, 1]
		]));
	});
});
describe("NumberTriangle.solve", () => {
	it("can solve the small example from AOPS", () => {
		const triangle = new NumberTriangle([
			[1],
			[2, 3],
			[4, 1, 1]
		]);
		assert.deepEqual(triangle.solve(2), ["L", "R"]);
	});
	it("can solve the larger example from AOPS", () => {
		const triangle = new NumberTriangle([
			[2],
			[4, 3],
			[3, 2, 6],
			[2, 9, 5, 2],
			[10, 5, 2, 15, 5]
		]);
		assert.deepEqual(triangle.solve(720), ["L", "R", "L", "L"]);
	});
});
