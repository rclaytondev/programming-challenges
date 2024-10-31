import { assert } from "chai";
import { describe } from "mocha";

type Path = ("L" | "R")[];

class NumberTriangle {
	rows: number[][];
	constructor(rows: number[][]) {
		this.rows = rows;
	}

	productsAndPaths(startRow: number, startIndex: number, endRow: number): Map<number, Path> {
		const firstEntry = this.rows[startRow][startIndex];
		if(startRow === endRow) {
			return new Map([[ firstEntry, [] ]]);
		}
		const result = new Map<number, Path>([]);
		for(const [newStartIndex, whichSide] of [[startIndex, "L"], [startIndex + 1, "R"]] as const) {
			for(const [product, path] of this.productsAndPaths(startRow + 1, newStartIndex, endRow)) {
				result.set(product * firstEntry, [whichSide, ...path]);
			}
		}
		return result;
	}

	solve(target: number) {
		/* Time complexity: O(n * sqrt(2)^n), where n is the number of rows. */
		const middleRow = Math.floor(this.rows.length / 2);
		const bottomPaths = new Array(middleRow + 1).fill(0).map((_, i) => 
			this.productsAndPaths(middleRow, i, this.rows.length - 1)
		);
		for(const [product, path] of this.productsAndPaths(0, 0, middleRow)) {
			const endColumn = path.filter(d => d === "R").length;
			const pathCompletion = bottomPaths[endColumn].get(target / product * this.rows[middleRow][endColumn]);
			if(pathCompletion) {
				return [...path, ...pathCompletion];
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
const AOPS_LARGE_EXAMPLE = new NumberTriangle([
	[2],
	[4, 3],
	[3, 2, 6],
	[2, 9, 5, 2],
	[10, 5, 2, 15, 5]
]);

describe("NumberTriangle.productsAndPaths", () => {
	it("returns a map where the keys are all the possible products and the values are the paths that result in those products", () => {
		assert.deepEqual(AOPS_LARGE_EXAMPLE.productsAndPaths(1, 1, 3), new Map([
			[3 * 2 * 9, ["L", "L"]],
			[3 * 2 * 5, ["L", "R"]],
			[3 * 6 * 5, ["R", "L"]],
			[3 * 6 * 2, ["R", "R"]]
		]));
	});
});
describe("NumberTriangle.solve", () => {
	it("can solve the small example from AOPS", () => {
		assert.deepEqual(AOPS_SMALL_EXAMPLE.solve(2), ["L", "R"]);
	});
	it("can solve the larger example from AOPS", () => {
		assert.deepEqual(AOPS_LARGE_EXAMPLE.solve(720), ["L", "R", "L", "L"]);
	});
});
