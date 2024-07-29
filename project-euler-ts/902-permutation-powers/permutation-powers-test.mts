import { describe, it } from "mocha";
import { Permutation, naiveRankPowerSum } from "./permutation-powers.mjs";
import { assert } from "chai";

describe("Permutation.rank", () => {
	it("correctly calculates the rank of the permutation [1, 2, 3]", () => {
		const permutation = new Permutation([1, 2, 3]);
		assert.equal(permutation.rank(), 1);
	});
	it("correctly calculates the rank of the permutation [1, 3, 2]", () => {
		const permutation = new Permutation([1, 3, 2]);
		assert.equal(permutation.rank(), 2);
	});
	it("correctly calculates the rank of the permutation [2, 1, 3]", () => {
		const permutation = new Permutation([2, 1, 3]);
		assert.equal(permutation.rank(), 3);
	});
	it("correctly calculates the rank of the permutation [2, 3, 1]", () => {
		const permutation = new Permutation([2, 3, 1]);
		assert.equal(permutation.rank(), 4);
	});
	it("correctly calculates the rank of the permutation [3, 1, 2]", () => {
		const permutation = new Permutation([3, 1, 2]);
		assert.equal(permutation.rank(), 5);
	});
	it("correctly calculates the rank of the permutation [3, 2, 1]", () => {
		const permutation = new Permutation([3, 2, 1]);
		assert.equal(permutation.rank(), 6);
	});
});
describe("Permutation.compose", () => {
	it("correctly composes the permutations", () => {
		const p1 = new Permutation([2, 1, 3]);
		const p2 = new Permutation([1, 3, 2]);
		const composition = Permutation.compose(p1, p2);
		assert.deepEqual(composition, new Permutation([2, 3, 1]));
	});
});
describe("Permutation.inverse", () => {
	it("correctly calculates the inverse", () => {
		const permutation = new Permutation([3, 1, 4, 2, 5]);
		const inverse = permutation.inverse();
		assert.deepEqual(inverse, new Permutation([2, 4, 1, 3, 5]));
	});
});
describe("naiveRankPowerSum", () => {
	it("works for 2", () => {
		const result = naiveRankPowerSum(2);
		assert.equal(result, 4);
	});
	it("works for 3", () => {
		const result = naiveRankPowerSum(3);
		assert.equal(result, 780);
	});
	it("works for 4", () => {
		const result = naiveRankPowerSum(4);
		assert.equal(result, 38810300);
	});
});
