import { assert } from "chai";
import { describe } from "mocha";
import { SymmetricGroup } from "../../specific-groups/SymmetricGroup.mjs";

describe("SymmetricGroup.compose", () => {
	it("correctly composes the permutations, doing it from right-to-left as usual", () => {
		assert.sameOrderedMembers(
			SymmetricGroup.compose([0, 2, 1], [1, 0, 2]),
			[2, 0, 1]
		);
	});
});

describe("SymmetricGroup.inverse", () => {
	it("correctly computes the inverse", () => {
		assert.sameOrderedMembers(
			SymmetricGroup.inverse([2, 0, 1]),
			[1, 2, 0]
		);
	});
});

describe("SymmetricGroup.permutations", () => {
	it("correctly yields all the permutations of the given number of elements, in lexicographic order", () => {
		const result = [...SymmetricGroup.permutations(3)];
		assert.sameDeepOrderedMembers(result, [
			[0, 1, 2],
			[0, 2, 1],
			[1, 0, 2],
			[1, 2, 0],
			[2, 0, 1],
			[2, 1, 0]
		]);
	});
});
