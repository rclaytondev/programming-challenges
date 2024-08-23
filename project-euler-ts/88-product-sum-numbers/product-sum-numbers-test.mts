import { describe, it } from "mocha";
import { assert } from "chai";
import { minimalProductSumNumber, solve } from "./product-sum-numbers.mjs";

describe("minimalProductSumNumber", () => {
	it("returns 4 = 2*2 = 2+2 for a set size of 2", () => {
		const result = minimalProductSumNumber(2);
		assert.equal(result, 4);
	});
	it("returns 6 = 1*2*3 = 1+2+3 for a set size of 3", () => {
		const result = minimalProductSumNumber(3);
		assert.equal(result, 6);
	});
	it("returns 8 = 1*1*2*4 = 1+1+2+4 for a set size of 4", () => {
		const result = minimalProductSumNumber(4);
		assert.equal(result, 8);
	});
	it("returns 8 = 1*1*2*2*2 = 1+1+2+2+2 for a set size of 5", () => {
		const result = minimalProductSumNumber(5);
		assert.equal(result, 8);
	});
	it("returns 12 = 1*1*2*6 = 1+1+1+1+2+6 for a set size of 6", () => {
		const result = minimalProductSumNumber(6);
		assert.equal(result, 12);
	});
});
describe("solve", () => {
	it("returns the correct result for 12", () => {
		const result = solve(12);
		assert.equal(result, 61);
	});
});
