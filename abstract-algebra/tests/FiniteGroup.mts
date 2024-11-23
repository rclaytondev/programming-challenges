import { describe } from "mocha";
import { CyclicGroup } from "../specific-groups/CyclicGroup.mjs";
import { assert } from "chai";

describe("FiniteGroup.quotient", () => {
	it("can correctly construct the quotient group, correctly calculating the cosets", () => {
		const group = new CyclicGroup(6);
		const subgroup = group.subgroup([0, 3]);
		const quotient = group.quotient(subgroup);
		const elements = [...quotient];
		assert.equal(elements.length, 3);
		assert.isTrue(elements.some(coset => coset.representative % 3 === 0));
		assert.isTrue(elements.some(coset => coset.representative % 3 === 1));
		assert.isTrue(elements.some(coset => coset.representative % 3 === 2));
	});
});
