import { describe } from "mocha";
import { CrossHatchedGrids } from "./cross-hatched-grids.mjs";
import { assert } from "chai";

describe("CrossHatchedGrids.tuplesWithMaxSum", () => {
	it("works when all the tuples in the given region have sum not exceeding the given sum", () => {
		const result = CrossHatchedGrids.tuplesWithMaxSum(10, 10, 20);
		assert.equal(result, 100);
	});
	it("works when some of the tuples in the given region have sum greater than the given sum", () => {
		const result = CrossHatchedGrids.tuplesWithMaxSum(10, 10, 19);
		assert.equal(result, 99);
	});
	it("works when one of the dimensions is much longer than the other", () => {
		const result = CrossHatchedGrids.tuplesWithMaxSum(10, 2, 5);
		assert.equal(result, 7);
	});
});
describe("CrossHatchedGrids.rotatedRectangles", () => {
	it("returns the number of rectangles within the cross-hatched grid that are rotated by 45 degrees", () => {
		const result = CrossHatchedGrids.rotatedRectangles(3, 2);
		assert.equal(result, 19);
	});
	it("works for a 2x2 grid", () => {
		const result = CrossHatchedGrids.rotatedRectangles(2, 2);
		assert.equal(result, 9);
	});
});
describe("CrossHatchedGrids.rectangles", () => {
	it("works for a 3x2 grid", () => {
		const result = CrossHatchedGrids.rectangles(3, 2);
		assert.equal(result, 37);
	});
	it("works for a 3x3 grid", () => {
		const result = CrossHatchedGrids.rectangles(3, 3);
		assert.equal(result, 69); // 37 + 32
	});
});
describe("CrossHatchedGrids.totalRectangles", () => {
	it("works for rectangles with size 3x2 and smaller", () => {
		const result = CrossHatchedGrids.totalRectangles(3, 2);
		assert.equal(result, 72);
	});
});
