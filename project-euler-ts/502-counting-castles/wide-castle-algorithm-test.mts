import { assert } from "chai";
import { describe, it } from "mocha";
import { fullHeightCastles } from "./wide-castle-algorithm.mjs";

describe("fullHeightCastles", () => {
	it("works for a 1x2 grid", () => {
		const result = fullHeightCastles(1, 2, 1_000_000_007);
		assert.equal(result, 1);
	});
	it("works for a 2x2 grid", () => {
		const result = fullHeightCastles(2, 2, 1_000_000_007);
		assert.equal(result, 3);
	});
	it("works for a 3x2 grid", () => {
		const result = fullHeightCastles(3, 2, 1_000_000_007);
		assert.equal(result, 6);
	});
	it("works for a 4x2 grid", () => {
		const result = fullHeightCastles(4, 2, 1_000_000_007);
		assert.equal(result, 10);
	});
	it("works for a 2x3 grid", () => {
		const result = fullHeightCastles(2, 3, 1_000_000_007);
		assert.equal(result, 0);
	});
	it("works for a 3x3 grid", () => {
		const result = fullHeightCastles(3, 3, 1_000_000_007);
		assert.equal(result, 3);
	});
	it("works for a 4x3 grid", () => {
		const result = fullHeightCastles(4, 3, 1_000_000_007);
		assert.equal(result, 21);
	});

	it("works for a 13x10 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(13, 10, 10_000_000_000_000);
		assert.equal(result, 3729050610636);
	});
	it("works for a 10x13 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(10, 13, 10_000_000_000_000);
		assert.equal(result, 37959702514);
	});
	it("works for a 10x13 grid with a modulo", () => {
		const result = fullHeightCastles(10, 13, 10 ** 5);
		assert.equal(result, 2514);
	});
});
