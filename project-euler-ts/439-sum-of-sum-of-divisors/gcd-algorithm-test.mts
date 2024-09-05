import { assert } from "chai";
import { describe, it } from "mocha";
import { naiveDivisorSumSum } from "./naive-solution.mjs";
import { divisorSumSum } from "./gcd-algorithm.mjs";

describe("divisorSumSum", () => {
	it("returns the same result as the naive algorithm for 2", () => {
		const expected = naiveDivisorSumSum(2);
		const actual = divisorSumSum(2);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 3", () => {
		const expected = naiveDivisorSumSum(3);
		const actual = divisorSumSum(3);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 4", () => {
		const expected = naiveDivisorSumSum(4);
		const actual = divisorSumSum(4);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 5", () => {
		const expected = naiveDivisorSumSum(5);
		const actual = divisorSumSum(5);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 10", () => {
		const expected = naiveDivisorSumSum(10);
		const actual = divisorSumSum(10);
		assert.equal(actual, expected);
	});
});
