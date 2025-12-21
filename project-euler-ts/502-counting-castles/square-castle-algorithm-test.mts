import { assert } from "chai";
import { describe, it } from "mocha";
import { fullHeightCastles, nextPaths } from "./square-castle-algorithm.mjs";

describe("fullHeightCastles (square castle algorithm)", () => {
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

describe("nextPaths", () => {
	it("works for an example with a height of 1", () => {
		const [evenPaths, oddPaths] = nextPaths([1n, 0n], [0n, 1n], 10n ** 12n);
		assert.sameOrderedMembers(evenPaths, [1n, 0n]);
		assert.sameOrderedMembers(oddPaths, [1n, 2n]);
	});
	it("works for an example with a height of 3", () => {
		const [evenPaths, oddPaths] = nextPaths([1n, 0n, 1n], [0n, 1n, 0n], 10n ** 12n);
		assert.sameOrderedMembers(evenPaths, [2n, 1n, 3n]);
		assert.sameOrderedMembers(oddPaths, [1n, 2n, 0n]);
	});
});
