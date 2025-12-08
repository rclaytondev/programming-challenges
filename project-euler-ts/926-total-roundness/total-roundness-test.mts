import { describe, it } from "mocha";
import { roundness } from "./total-roundness.mjs";
import { assert } from "chai";

describe("roundness", () => {
	it("works for 20", () => {
		const result = roundness(20);
		assert.equal(result, 6);
	});
});
