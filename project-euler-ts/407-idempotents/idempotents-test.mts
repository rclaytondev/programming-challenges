import { assert } from "chai";
import { idempotentSum } from "./idempotents.mjs";
import { naiveIdempotentSum } from "./naive-algorithm.mjs";

describe("idempotentSum", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveIdempotentSum(1000);
		const actual = idempotentSum(1000);
		assert.equal(actual, expected);
	});
});
