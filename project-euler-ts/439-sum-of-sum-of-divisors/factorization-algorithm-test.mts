import { assert } from "chai";
import { describe, it } from "mocha";
import { divisorSumSum, factorizeAll } from "./factorization-algorithm.mjs";
import { naiveDivisorSumSum } from "./naive-solution.mjs";

describe("factorizeAll", () => {
	it("returns an array containing the factorziations of all numbers from 1 to the upper bound", () => {
		const factorizations = factorizeAll(10);
		assert.deepEqual(factorizations, new Map([
			[1, new Map()],
			[2, new Map([[2, 1]])],
			[3, new Map([[3, 1]])],
			[4, new Map([[2, 2]])],
			[5, new Map([[5, 1]])],
			[6, new Map([[2, 1], [3, 1]])],
			[7, new Map([[7, 1]])],
			[8, new Map([[2, 3]])],
			[9, new Map([[3, 2]])],
			[10, new Map([[2, 1], [5, 1]])]
		]));
	});
});
describe("divisorSumSum", () => {
	it("returns the same result as the naive algorithm for 10", () => {
		const expected = naiveDivisorSumSum(10);
		const actual = divisorSumSum(10);
		assert.equal(actual, expected);
	});
});
