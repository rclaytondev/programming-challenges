import { describe } from "mocha";
import { isSpecial, optimalSpecialSet } from "./special-subset-sums-optimum-2.mjs";
import { assert } from "chai";

describe("isSpecial", () => {
	it("returns true for [2, 3, 4]", () => {
		assert.isTrue(isSpecial([2, 3, 4]));
	});
	it("returns false for [1, 2, 3, 5]", () => {
		assert.isFalse(isSpecial([1, 2, 3, 5]));
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
	// it("can return the optimal special set of size 5", () => {
	// 	const set = optimalSpecialSet(5);
	// 	assert.sameMembers(set, [6, 9, 11, 12, 13]);
	// });
});
