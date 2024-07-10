import { describe, it } from "mocha";
import { naiveProbabilitySum, probabilitySum } from "./claire-voyant-2.mjs";
import { assert } from "chai";

describe("probabilitySum", () => {
	it("returns the same result as the naive algorithm for a test case with 2 probabilities", () => {
		const expected = naiveProbabilitySum([0.2, 0.4], 0.6);
		const actual = probabilitySum([0.2, 0.4], 0.6);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for a test case with 3 probabilities", () => {
		const expected = naiveProbabilitySum([0.2, 0.4, 0.6], 0.8);
		const actual = probabilitySum([0.2, 0.4, 0.6], 0.8);
		assert.equal(actual, expected);
	});
});
