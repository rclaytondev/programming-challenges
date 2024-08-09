import { describe, it } from "mocha";
import { divSqSumSum } from "./sum-of-squares-of-divisors.mjs";
import { assert } from "chai";

describe("divSqSumSum", () => {
	it("returns 1 when given 1", () => {
		const result = divSqSumSum(1n);
		assert.equal(result, 1n);
	});
	it("returns 6 when given 2", () => {
		const result = divSqSumSum(2n);
		assert.equal(result, 6n);
	});
	it("returns 16 when given 3", () => {
		const result = divSqSumSum(3n);
		assert.equal(result, 16n);
	});
	it("returns 37 when given 4", () => {
		const result = divSqSumSum(4n);
		assert.equal(result, 37n);
	});
	it("returns 63 when given 5", () => {
		const result = divSqSumSum(5n);
		assert.equal(result, 63n);
	});
	it("returns 113 when given 6", () => {
		const result = divSqSumSum(6n);
		assert.equal(result, 113n);
	});
});
