import { describe } from "mocha";
import { Partition } from "./Partition.mjs";
import { assert } from "chai";

describe("Partition", () => {
	it("can add items, merge sets, and get representatives", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		assert.equal(partition.representative(1), 1);
		partition.add(2);
		assert.equal(partition.representative(2), 2);
		partition.merge(1, 2);
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		assert.equal(representative1, representative2);
		assert.isTrue(representative1 === 1 || representative1 === 2);
	});
});
