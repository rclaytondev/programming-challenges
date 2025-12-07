import { assert } from "chai";
import { numDivisible, numSquarefree, sizeOfUnion } from "./squarefree-numbers-2.mjs";
import { naiveNumDivisible, naiveNumSquarefree } from "./naive-algorithm.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";

describe("sizeOfUnion", () => {
	it("can use the inclusion-exclusion principle to find the size of a union of set-like objects", () => {
		const result = sizeOfUnion(
			[new Set([1, 2]), new Set([3]), new Set([1, 4]), new Set([2, 3]), new Set([3, 5])],
			s => s.size,
			SetUtils.intersection
		);
		assert.equal(result, 5);
	});
	it("works for a very simple example", () => {
		const result = sizeOfUnion(
			[new Set([1, 2]), new Set([2, 3])],
			s => s.size,
			SetUtils.intersection
		);
		assert.equal(result, 3);
	});
});

describe("numSquarefree", () => {
	it("can compute the number of squarefree numbers strictly less than 13", () => {
		const result = numSquarefree(13);
		assert.equal(result, 8);
	});
	it("gives the same result as the naive algorithm for an input of 50", () => {
		const expected = naiveNumSquarefree(50);
		const actual = numSquarefree(50);
		assert.equal(actual, expected);
	});
	it("gives the same result as the naive algorithm for an input of 100", () => {
		const expected = naiveNumSquarefree(100);
		const actual = numSquarefree(100);
		assert.equal(actual, expected);
	});
	it("gives the same result as the naive algorithm for an input of 200", () => {
		const expected = naiveNumSquarefree(200);
		const actual = numSquarefree(200);
		assert.equal(actual, expected);
	});
	it("gives the same result as the naive algorithm for an input of 500", () => {
		const expected = naiveNumSquarefree(500);
		const actual = numSquarefree(500);
		assert.equal(actual, expected);
	});
	it("gives the same result as the naive algorithm for an input of 1000", () => {
		const expected = naiveNumSquarefree(1000);
		const actual = numSquarefree(1000);
		assert.equal(actual, expected);
	});
});
describe("numDivisible", () => {
	it("can count the number of integers strictly less than 30 that are divisible by 3 or 5", () => {
		const result = numDivisible([3, 5], 30);
		assert.equal(result, 13); // 3, 5, 6, 9, 10, 12, 15, 18, 20, 21, 24, 25, 27
	});
});
describe("naiveNumDivisible", () => {
	it("can count the number of integers strictly less than 30 that are divisible by 3 or 5", () => {
		const result = naiveNumDivisible([3, 5], 30);
		assert.equal(result, 13); // 3, 5, 6, 9, 10, 12, 15, 18, 20, 21, 24, 25, 27
	});
});
