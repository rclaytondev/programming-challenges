import { describe, it } from "mocha";
import { numBlockCombinations } from "./block-combinations-II.mjs";
import { assert } from "chai";

describe("numBlockCombinatons", () => {
	it("can count the number of tilings of a 1x29 rectangle with non-adjacent blocks of length at least 3", () => {
		const result = numBlockCombinations(3, 29);
		assert.equal(result, 673135);
	});
	it("can count the number of tilings of a 1x5 rectangle with non-adjacent blocks of length at least 3", () => {
		const result = numBlockCombinations(3, 5);
		assert.equal(result, 7);
	});
	it("can count the number of tilings of a 1x6 rectangle with non-adjacent blocks of length at least 3", () => {
		const result = numBlockCombinations(3, 6);
		assert.equal(result, 11);
	});
});
