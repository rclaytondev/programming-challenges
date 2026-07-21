import { describe } from "mocha";
import { ColoredRectangle } from "./rectangle-colorings-2.mjs";
import { assert } from "chai";

describe("ColoredRectangle.colorings", () => {
	it("matches the result from Project Euler for a 2x2 square with 3 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 3);
		const colorings = rectangle.colorings();
		assert.equal(colorings, 18n);
	});
	it("matches the result from Project Euler for a 2x2 square with 20 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 20);
		const colorings = rectangle.colorings();
		assert.equal(colorings, 130340n);
	});
	it("matches the result from Project Euler for a 3x4 rectangle with 6 colors", () => {
		const rectangle = ColoredRectangle.empty(3, 4, 6);
		const colorings = rectangle.colorings();
		assert.equal(colorings, 102923670n);
	});
});

describe("ColoredRectangle.coloringSum", () => {
	it("matches the result from Project Euler for a 4x4 with at most 15 colors", () => {
		const sum = ColoredRectangle.coloringSum(4, 4, 15);
		assert.equal(sum % (10n ** 9n + 7n), 325951319n);
	});
});

describe("ColoredRectangle.rowCombinations", () => {
	it("returns all the ways of coloring the given row, up to permuting the colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 3);
		const rowCombinations = rectangle.rowCombinations(0);
		assert.sameDeepMembers(rowCombinations, [ [0, 1] ]);
	});
});
