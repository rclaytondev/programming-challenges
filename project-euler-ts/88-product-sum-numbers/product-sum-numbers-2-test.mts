import { describe, it } from "mocha";
import { isProductSumNumber } from "./product-sum-numbers.mjs";
import { assert } from "chai";
import { solve } from "./product-sum-numbers-2.mjs";

describe("solve", () => {
	it("returns 4 when given an input of 2", () => {
		const result = solve(2);
		assert.equal(result, 4);
	});
	it("returns 4+6 when given an input of 3", () => {
		const result = solve(3);
		assert.equal(result, 10);
	});
	it("returns 4+6+8 when given an input of 4", () => {
		const result = solve(4);
		assert.equal(result, 18);
	});
	it("returns 4+6+8 when given an input of 5", () => {
		const result = solve(5);
		assert.equal(result, 18);
	});
	it("returns 4+6+8+12 when given an input of 6", () => {
		const result = solve(6);
		assert.equal(result, 30);
	});
	it("returns 61 when given an input of 12", () => {
		const result = solve(12);
		assert.equal(result, 61);
	});
});
