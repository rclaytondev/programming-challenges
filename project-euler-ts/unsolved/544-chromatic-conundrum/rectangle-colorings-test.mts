import { describe } from "mocha";
import { ColoredRectangle } from "./rectangle-colorings.mjs";
import { assert } from "chai";

describe("ColoredRectangle.colorings", () => {
	it("matches the result from Project Euler for a 2x2 square with 3 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2);
		const colorings = rectangle.colorings().evaluate(3n);
		assert.equal(colorings, 18n);
	});
	it("matches the result from Project Euler for a 2x2 square with 20 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2);
		const colorings = rectangle.colorings().evaluate(20n);
		assert.equal(colorings, 130340n);
	});
	it("matches the result from Project Euler for a 3x4 rectangle with 6 colors", () => {
		const rectangle = ColoredRectangle.empty(3, 4);
		const colorings = rectangle.colorings().evaluate(6n);
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
		const rectangle = ColoredRectangle.empty(2, 2);
		const rowCombinations = rectangle.rowCombinations(0);
		assert.sameDeepMembers(rowCombinations, [ [0, 1] ]);
	});
});

describe("ColoredRectangle.normalize (static method)", () => {
	it("replaces the numbers with the numbers 0, 1, 2, ... according to their first appearance", () => {
		const numbers = [5, 7, 5, 4, 4, 3, 5, 4, 1];
		const normalized = ColoredRectangle.normalize(numbers);
		assert.sameOrderedMembers(normalized, [0, 1, 0, 2, 2, 3, 0, 2, 4]);
	});
});

describe("ColoredRectangle.normalize", () => {
	it("maps any equivalent rectangles to the same rectangle", () => {
		const rectangle = new ColoredRectangle(3, 2, [1, 0], null, [2, 3, 6], [4, 3, 2]);
		const recolored = new ColoredRectangle(3, 2, [0, 1], null, [6, 2, 3], [7, 2, 6]);

		const normalized1 = rectangle.normalize();
		const normalized2 = rectangle.reflectX().normalize();
		const normalized3 = rectangle.reflectY().normalize();
		const normalized4 = rectangle.reflectX().reflectY().normalize();
		const normalized5 = rectangle.transpose().normalize();
		const normalized6 = rectangle.transpose().reflectX().normalize();
		const normalized7 = rectangle.transpose().reflectY().normalize();
		const normalized8 = rectangle.transpose().reflectX().reflectY().normalize();

		const normalized9 = recolored.normalize();
		const normalized10 = recolored.reflectX().normalize();
		const normalized11 = recolored.reflectY().normalize();
		const normalized12 = recolored.reflectX().reflectY().normalize();
		const normalized13 = recolored.transpose().normalize();
		const normalized14 = recolored.transpose().reflectX().normalize();
		const normalized15 = recolored.transpose().reflectY().normalize();
		const normalized16 = recolored.transpose().reflectX().reflectY().normalize();

		assert.deepEqual(normalized1, normalized2);
		assert.deepEqual(normalized1, normalized3);
		assert.deepEqual(normalized1, normalized4);
		assert.deepEqual(normalized1, normalized5);
		assert.deepEqual(normalized1, normalized6);
		assert.deepEqual(normalized1, normalized7);
		assert.deepEqual(normalized1, normalized8);
		assert.deepEqual(normalized1, normalized9);
		assert.deepEqual(normalized1, normalized10);
		assert.deepEqual(normalized1, normalized11);
		assert.deepEqual(normalized1, normalized12);
		assert.deepEqual(normalized1, normalized13);
		assert.deepEqual(normalized1, normalized14);
		assert.deepEqual(normalized1, normalized15);
		assert.deepEqual(normalized1, normalized16);
	});
});

describe("ColoredRectangle.allMinima", () => {
	it("returns all of the elements that are minima of the given ordering", () => {
		const nums = [2, 3, 1, 1, 3, 3, 1, 2, 1, 3];
		const minima = ColoredRectangle.allMinima(nums, (a, b) => a - b);
		assert.sameOrderedMembers(minima, [1, 1, 1, 1]);
	});
});
