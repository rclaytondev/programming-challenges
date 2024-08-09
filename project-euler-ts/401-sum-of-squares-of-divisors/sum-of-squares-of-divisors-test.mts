import { describe, it } from "mocha";
import { divSqSumSum } from "./sum-of-squares-of-divisors.mjs";
import { assert } from "chai";

describe("divSqSumSum", () => {
	it("returns 1 when given 1", () => {
		const result = divSqSumSum(1);
		assert.equal(result, 1);
	});
	it("returns 6 when given 2", () => {
		const result = divSqSumSum(2);
		assert.equal(result, 6);
	});
	it("returns 16 when given 3", () => {
		const result = divSqSumSum(3);
		assert.equal(result, 16);
	});
	it("returns 37 when given 4", () => {
		const result = divSqSumSum(4);
		assert.equal(result, 37);
	});
	it("returns 63 when given 5", () => {
		const result = divSqSumSum(5);
		assert.equal(result, 63);
	});
	it("returns 113 when given 6", () => {
		const result = divSqSumSum(6);
		assert.equal(result, 113);
	});
});
