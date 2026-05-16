import { assert } from "chai";
import { describe, it } from "mocha";
import { smallestLosing } from "./distribunim-II.mjs";

describe("smallestLosing", () => {
	it("returns 0 for 1", () => {
		assert.equal(smallestLosing(1), 0);
	});
	it("returns 0 for 2", () => {
		assert.equal(smallestLosing(2), 0);
	});
	it("returns 2 for 3", () => {
		assert.equal(smallestLosing(3), 2);
	});
});
