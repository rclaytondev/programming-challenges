import { assert } from "chai";
import { describe, it } from "mocha";
import { fullHeightCastles, pathsFromCorner, pathsFromMiddle } from "./tall-castle-algorithm.mjs";

describe("fullHeightCastles (tall castle algorithm)", () => {
	it("works for a 1x2 grid", () => {
		const result = fullHeightCastles(1n, 2n, 10n ** 12n);
		assert.equal(result, 1n);
	});
	it("works for a 2x2 grid", () => {
		const result = fullHeightCastles(2n, 2n, 10n ** 12n);
		assert.equal(result, 3n);
	});
	it("works for a 3x2 grid", () => {
		const result = fullHeightCastles(3n, 2n, 10n ** 12n);
		assert.equal(result, 6n);
	});
	it("works for a 4x2 grid", () => {
		const result = fullHeightCastles(4n, 2n, 10n ** 12n);
		assert.equal(result, 10n);
	});
	it("works for a 2x3 grid", () => {
		const result = fullHeightCastles(2n, 3n, 10n ** 12n);
		assert.equal(result, 0n);
	});
	it("works for a 3x3 grid", () => {
		const result = fullHeightCastles(3n, 3n, 10n ** 12n);
		assert.equal(result, 3n);
	});
	it("works for a 4x3 grid", () => {
		const result = fullHeightCastles(4n, 3n, 10n ** 12n);
		assert.equal(result, 21n);
	});

	it("works for a 13x10 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(13n, 10n, 10n ** 18n);
		assert.equal(result, 3729050610636n);
	});
	it("works for a 10x13 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(10n, 13n, 10n ** 18n);
		assert.equal(result, 37959702514n);
	});
	it("works for a 10x13 grid with a modulo", () => {
		const result = fullHeightCastles(10n, 13n, 10n ** 5n);
		assert.equal(result, 2514n);
	});
});
describe("pathsFromCorner", () => {
	it("can count the number of paths diagonally across a 1x1 square with an odd number of steps up", () => {
		const result = pathsFromCorner(1n, 1n, "up", "up", "odd", 10n ** 12n);
		assert.equal(result, 2n);
	});
	it("can count the number of paths diagonally across a 1x1 square with an even number of steps up", () => {
		const result = pathsFromCorner(1n, 1n, "up", "up", "even", 10n ** 12n);
		assert.equal(result, 0n);
	});
	it("can count the number of paths across a 2x2 square with an odd number of steps up", () => {
		const result = pathsFromCorner(2n, 2n, "down", "up", "odd", 10n ** 12n);
		assert.equal(result, 3n);
	});
});
describe("pathsFromMiddle", () => {
	it("works for a 1x1 example starting at the top-left and moving up to the top-right with an odd number of steps up", () => {
		const result = pathsFromMiddle(1n, 1n, 1n, "up", "up", "odd", "up", 10n ** 12n);
		assert.equal(result, 0n);
	});
	it("works for a 1x2 example starting from the top-left and moving down to the bottom-right with an odd number of steps up", () => {
		const result = pathsFromMiddle(1n, 2n, 2n, "down", "up", "odd", "down", 10n ** 12n);
		assert.equal(result, 0n);
	});
});
