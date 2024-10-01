import { describe } from "mocha";
import { isSpecial, optimalSpecialSet, subsetHasSum } from "./special-subset-sums-optimum-2.mjs";
import { assert } from "chai";

describe("subsetHasSum", () => {
	it("returns true for the input of ([8, 9, 13], 17)", () => {
		assert.isTrue(subsetHasSum([8, 9, 13], 17));
	});
	it("returns true for the input of ([25, 26, 28, 33, 40], 51)", () => {
		assert.isTrue(subsetHasSum([25, 26, 28, 33, 40], 51));
	});
});
describe("isSpecial", () => {
	it("returns true for [2, 3, 4]", () => {
		assert.isTrue(isSpecial([2, 3, 4]));
	});
	it("returns false for [1, 2, 3, 5]", () => {
		assert.isFalse(isSpecial([1, 2, 3, 5]));
	});
	it("returns false for [3, 4, 5, 6]", () => {
		assert.isFalse(isSpecial([3, 4, 5, 6]));
	});
	it("returns false for [7, 8, 9, 10, 13]", () => {
		assert.isFalse(isSpecial([7, 8, 9, 10, 13]));
	});
	it("returns false for [24, 25, 26, 27, 28, 33, 40]", () => {
		assert.isFalse(isSpecial([24, 25, 26, 27, 28, 33, 40])); // 24 + 27 = 25 + 26
	});
});
describe("optimalSpecialSet", () => {
	it("can return the optimal special set of size 1", () => {
		const set = optimalSpecialSet(1);
		assert.sameMembers(set, [1]);
	});
	it("can return the optimal special set of size 2", () => {
		const set = optimalSpecialSet(2);
		assert.sameMembers(set, [1, 2]);
	});
	it("can return the optimal special set of size 3", () => {
		const set = optimalSpecialSet(3);
		assert.sameMembers(set, [2, 3, 4]);
	});
	it("can return the optimal special set of size 4", () => {
		const set = optimalSpecialSet(4);
		assert.sameMembers(set, [3, 5, 6, 7]);
	});
	it("can return the optimal special set of size 5", () => {
		const set = optimalSpecialSet(5);
		assert.sameMembers(set, [6, 9, 11, 12, 13]);
	});
});
