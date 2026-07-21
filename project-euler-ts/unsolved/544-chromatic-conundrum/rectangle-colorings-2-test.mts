import { describe } from "mocha";
import { ColoredRectangle } from "./rectangle-colorings-2.mjs";
import { assert } from "chai";

describe("ColoredRectangle.colorings", () => {
	it("matches the result from Project Euler for a 2x2 square with 3 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 3);
		const colorings = rectangle.colorings();
		assert.equal(colorings, 18);
	});
});

describe("ColoredRectangle.rowCombinations", () => {
	it("returns all the ways of coloring the given row, up to permuting the colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 3);
		const rowCombinations = rectangle.rowCombinations(0);
		assert.sameDeepMembers(rowCombinations, [ [0, 1] ]);
	});
});
