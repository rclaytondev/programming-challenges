import { describe } from "mocha";
import { optimalSpecialSet } from "./special-subset-sums-optimum-3.mjs";
import { assert } from "chai";

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
