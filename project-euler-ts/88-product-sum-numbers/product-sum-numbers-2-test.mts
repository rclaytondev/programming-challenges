import { describe, it } from "mocha";
import { isProductSumNumber } from "./product-sum-numbers.mjs";
import { assert } from "chai";
import { solve } from "./product-sum-numbers-2.mjs";

describe("solve", () => {
	it("returns 61 when given an input of 12", () => {
		const result = solve(12);
		assert.equal(result, 61);
	});
});
