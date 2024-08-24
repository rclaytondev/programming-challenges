import { describe, it } from "mocha";
import { canExpress, compare, includesWithRotation, subsetsContaining, subsetsOfMaxSize, subsetsOfSize } from "./cube-digit-pairs.mjs";
import { assert } from "chai";

describe("subsetsOfSize", () => {
	it("returns a list of all the subsets of the given set that have the given size", () => {
		const result = subsetsOfSize(["a", "b", "c", "d"], 2);
		assert.sameDeepMembers(result, [
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
});
describe("subsetsOfMaxSize", () => {
	it("returns a list of all the subsets of the given set that have size less than or equal to the given size", () => {
		const result = subsetsOfMaxSize(["a", "b", "c", "d"], 2);
		assert.sameDeepMembers(result, [
			new Set([]),
			
			new Set(["a"]),
			new Set(["b"]),
			new Set(["c"]),
			new Set(["d"]),

			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
});
describe("subsetsContaining", () => {
	it("returns a list of subsets that contain the given elements and have size less than or equal to the given size", () => {
		const result = subsetsContaining(["a", "b", "c", "d"], 3, ["a"]);
		assert.sameDeepMembers(result, [
			new Set(["a"]),

			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),

			new Set(["a", "b", "c"]),
			new Set(["a", "b", "d"]),
			new Set(["a", "c", "d"])
		]);
	});
	it("works when the required set has more than 1 element", () => {
		const result = subsetsContaining(["a", "b", "c", "d", "e"], 4, ["a", "b"]);
		assert.sameDeepMembers(result, [
			new Set(["a", "b"]),

			new Set(["a", "b", "c"]),
			new Set(["a", "b", "d"]),
			new Set(["a", "b", "e"]),

			new Set(["a", "b", "c", "d"]),
			new Set(["a", "b", "c", "e"]),
			new Set(["a", "b", "d", "e"]),
		]);
	});
});
describe("includesWithRotation", () => {
	it("returns true if the set contains the number", () => {
		assert.isTrue(includesWithRotation([1, 2, 3], 2));
		assert.isFalse(includesWithRotation([1, 2, 3], 4));
	});
	it("returns true if the number is 6 or 9 and the set contains 6 or 9", () => {
		assert.isTrue(includesWithRotation([6], 6));
		assert.isTrue(includesWithRotation([6], 9));
		assert.isTrue(includesWithRotation([9], 6));
		assert.isTrue(includesWithRotation([9], 9));
		assert.isTrue(includesWithRotation([9, 6], 6));
		assert.isTrue(includesWithRotation([9, 6], 9));
	});
});
describe("canExpress", () => {
	it("returns true if the 2-digit number can be expressed using the dice", () => {
		assert.isTrue(canExpress([0, 5, 6, 7, 8, 9], [1, 2, 3, 4, 6, 7], [0, 1]));
		assert.isTrue(canExpress([0, 5, 6, 7, 8, 9], [1, 2, 3, 4, 6, 7], [3, 6]));
		assert.isTrue(canExpress([0, 5, 6, 7, 8, 9], [1, 2, 3, 4, 6, 7], [5, 9]));
	});
	it("returns false if the 2-digit number cannot be expressed using the dice", () => {
		assert.isFalse(canExpress([0, 5, 6, 7, 8, 9], [1, 2, 3, 4, 6, 7], [2, 3]));
		assert.isFalse(canExpress([0, 5, 6, 7, 8, 9], [1, 2, 3, 4, 6, 7], [5, 8]));
	});
});
describe("compare", () => {
	it("compares the arrays lexicographically after sorting", () => {
		assert.equal(compare([1, 2, 3], [4, 5, 6]), -1);
		assert.equal(compare([4, 5, 6], [1, 2, 3]), 1);
		assert.equal(compare([1, 2, 3], [1, 2, 300]), -1);
		assert.equal(compare([1, 2, 300], [1, 2, 3]), 1);
		assert.equal(compare([1, 2], [1, 2, 3]), -1);
		assert.equal(compare([1, 2, 3], [1, 2]), 1);
	});
});
