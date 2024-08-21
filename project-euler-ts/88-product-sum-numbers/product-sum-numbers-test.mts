import { describe, it } from "mocha";
import { isProductSumNumber } from "./product-sum-numbers.mjs";
import { assert } from "chai";

describe("isProductSumNumber", () => {
	it("returns true for 12 with a set size of 6", () => {
		const result = isProductSumNumber(12, 6);
		assert.equal(result, true);
	});
	it("returns false for 11 with a set size of 6", () => {
		const result = isProductSumNumber(11, 6);
		assert.equal(result, false);
	});
});
