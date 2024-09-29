import { describe, it } from "mocha";
import { naiveIdempotentSum } from "./naive-algorithm.mjs";
import { idempotentSum } from "./idempotents-3.mjs";
import { assert } from "chai";

describe("idempotentSum", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveIdempotentSum(1000);
		const actual = idempotentSum(1000);
		assert.equal(actual, expected);
	});
});
