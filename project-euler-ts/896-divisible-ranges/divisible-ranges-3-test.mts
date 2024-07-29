import { assert } from "chai";
import { describe } from "mocha";
import { divisibleRanges, solve } from "./divisible-ranges-3.mjs";

describe("divisibleRanges", () => {
	it("can correctly calculate some divisible ranges of length 10", () => {
		const result = divisibleRanges(10).termsBelow(500);
		assert.deepEqual(result, [1, 2, 3, 110, 111, 324, 327, 362, 363, 420, 421, 422, 423, 468, 469]);
	});
});

describe("solve", () => {
	it("returns 2 when given 2", () => {
		assert.equal(solve(2), 2);
	});
	it("returns 5 when given 5", () => {
		assert.equal(solve(5), 5);
	});
	it("returns 420 when given 10", () => {
		assert.equal(solve(10), 420);
	});
	it("returns 7394 when given an input of 15", () => {
		assert.equal(solve(15), 7394);
	});
});
