import { describe, it } from "mocha";
import { naiveAllIdempotents, naiveIdempotentSum } from "./naive-algorithm.mjs";
import { allIdempotents, idempotentSum } from "./idempotents-3.mjs";
import { assert } from "chai";

describe("idempotentSum", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveIdempotentSum(1000);
		const actual = idempotentSum(1000);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 2000", () => {
		const expected = naiveIdempotentSum(2000);
		const actual = idempotentSum(2000);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 10000", () => {
		const expected = naiveIdempotentSum(10000);
		const actual = idempotentSum(10000);
		assert.equal(actual, expected);
	});
});
describe("allIdempotents", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveAllIdempotents(1000);
		const actual = allIdempotents(1000);
		assert.deepEqual(actual, expected);
	});
});
