import { assert } from "chai";
import { describe, it } from "mocha";
import { fullHeightCastles, pathsFromCorner, pathsFromMiddle } from "./tall-castle-algorithm.mjs";

describe("fullHeightCastles (tall castle algorithm)", () => {
	it("works for a 1x2 grid", () => {
		const result = fullHeightCastles(1, 2);
		assert.equal(result, 1);
	});
	it("works for a 2x2 grid", () => {
		const result = fullHeightCastles(2, 2);
		assert.equal(result, 3);
	});
	it("works for a 3x2 grid", () => {
		const result = fullHeightCastles(3, 2);
		assert.equal(result, 6);
	});
	it("works for a 4x2 grid", () => {
		const result = fullHeightCastles(4, 2);
		assert.equal(result, 10);
	});
	it("works for a 2x3 grid", () => {
		const result = fullHeightCastles(2, 3);
		assert.equal(result, 0);
	});
	it("works for a 3x3 grid", () => {
		const result = fullHeightCastles(3, 3);
		assert.equal(result, 3);
	});
	it("works for a 4x3 grid", () => {
		const result = fullHeightCastles(4, 3);
		assert.equal(result, 21);
	});

	it("works for a 13x10 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(13, 10);
		assert.equal(result, 3729050610636);
	});
	it("works for a 10x13 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(10, 13);
		assert.equal(result, 37959702514);
	});
	// it("works for a 10x13 grid with a modulo", () => {
	// 	const result = fullHeightCastles(10, 13, 10 ** 5);
	// 	assert.equal(result, 2514);
	// });
});
describe("pathsFromCorner", () => {
	it("can count the number of paths diagonally across a 1x1 square with an odd number of steps up", () => {
		const result = pathsFromCorner(1, 1, "up", "up", "odd");
		assert.equal(result, 2);
	});
	it("can count the number of paths diagonally across a 1x1 square with an even number of steps up", () => {
		const result = pathsFromCorner(1, 1, "up", "up", "even");
		assert.equal(result, 0);
	});
	it("can count the number of paths across a 2x2 square with an odd number of steps up", () => {
		const result = pathsFromCorner(2, 2, "down", "up", "odd");
		assert.equal(result, 3);
	});
});
describe("pathsFromMiddle", () => {
	it("works for a 1x1 example starting at the top-left and moving up to the top-right with an odd number of steps up", () => {
		const result = pathsFromMiddle(1, 1, 1, "up", "up", "odd", "up");
		assert.equal(result, 0);
	});
	it("works for a 1x2 example starting from the top-left and moving down to the bottom-right with an odd number of steps up", () => {
		const result = pathsFromMiddle(1, 2, 2, "down", "up", "odd", "down");
		assert.equal(result, 0);
	});
});
