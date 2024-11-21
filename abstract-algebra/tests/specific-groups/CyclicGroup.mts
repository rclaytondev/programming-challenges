import { describe } from "mocha";
import { CyclicGroup } from "../../specific-groups/CyclicGroup.mjs";
import { assert } from "chai";

describe("CyclicGroup iteration", () => {
	it("can iterate over all the integers from 0 to the size minus 1, and resets the iteration with each new call", () => {
		const group = new CyclicGroup(3);
		const array = [...group.elements, ...group.elements];
		assert.sameMembers(array, [0, 1, 2, 0, 1, 2]);
	});
});
