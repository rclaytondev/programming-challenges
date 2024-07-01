import { assert } from "chai";
import { describe } from "mocha";
import { isSNumber } from "./number-splitting.mjs";

describe("isSNumber", () => {
	it("returns true if the number's digits can be sliced up to produce a list of numbers that sum to its square root", () => {
		assert.isTrue(isSNumber(6724));
	});
	it("works for numbers that contain 0's", () => {
		assert.isTrue(isSNumber(100));
	});
});
