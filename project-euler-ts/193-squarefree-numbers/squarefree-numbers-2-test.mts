import { assert } from "chai";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { numSquarefree, sizeOfUnion } from "./squarefree-numbers-2.mjs";

describe("sizeOfUnion", () => {
	it("can use the inclusion-exclusion principle to find the size of a union of set-like objects", () => {
		const result = sizeOfUnion(
			[new Set([1, 2]), new Set([3]), new Set([1, 4]), new Set([2, 3]), new Set([3, 5])],
			s => s.size,
			Utils.intersection
		);
		assert.equal(result, 5);
	});
	it("works for a very simple example", () => {
		const result = sizeOfUnion(
			[new Set([1, 2]), new Set([2, 3])],
			s => s.size,
			Utils.intersection
		);
		assert.equal(result, 3);
	});
});

describe("numSquarefree", () => {
	it("can compute the number of squarefree numbers strictly less than 13", () => {
		const result = numSquarefree(13);
		assert.equal(result, 8);
	});
});
