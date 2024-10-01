import { describe } from "mocha";
import { requiredSubsetPairs } from "./special-subset-sums-meta-testing.mjs";
import { assert } from "chai";

describe("requiredSubsetPairs", () => {
	it("works for 4", () => {
		const result = requiredSubsetPairs(4);
		assert.equal(result, 1);
	});
	it("works for 7", () => {
		const result = requiredSubsetPairs(7);
		assert.equal(result, 70);
	});
});
