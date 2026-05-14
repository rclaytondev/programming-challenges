import { assert } from "chai";
import { describe, it } from "mocha";
import { fullHeightCastles } from "./wide-castle-algorithm.mjs";

describe("fullHeightCastles (wide castle algorithm)", () => {
	it("works for a 1x2 grid", () => {
		const result = fullHeightCastles(1n, 2n, 1_000_000_007n);
		assert.equal(result, 1n);
	});
	it("works for a 2x2 grid", () => {
		const result = fullHeightCastles(2n, 2n, 1_000_000_007n);
		assert.equal(result, 3n);
	});
	it("works for a 3x2 grid", () => {
		const result = fullHeightCastles(3n, 2n, 1_000_000_007n);
		assert.equal(result, 6n);
	});
	it("works for a 4x2 grid", () => {
		const result = fullHeightCastles(4n, 2n, 1_000_000_007n);
		assert.equal(result, 10n);
	});
	it("works for a 2x3 grid", () => {
		const result = fullHeightCastles(2n, 3n, 1_000_000_007n);
		assert.equal(result, 0n);
	});
	it("works for a 3x3 grid", () => {
		const result = fullHeightCastles(3n, 3n, 1_000_000_007n);
		assert.equal(result, 3n);
	});
	it("works for a 4x3 grid", () => {
		const result = fullHeightCastles(4n, 3n, 1_000_000_007n);
		assert.equal(result, 21n);
	});

	it("works for a 13x10 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(13n, 10n, 10_000_000_000_000n);
		assert.equal(result, 3729050610636n);
	});
	it("works for a 10x13 grid (test case from Project Euler)", () => {
		const result = fullHeightCastles(10n, 13n, 10_000_000_000_000n);
		assert.equal(result, 37959702514n);
	});
	it("works for a 10x13 grid with a modulo", () => {
		const result = fullHeightCastles(10n, 13n, 10n ** 5n);
		assert.equal(result, 2514n);
	});
});
