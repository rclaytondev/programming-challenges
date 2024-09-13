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
	it("correctly handles multiple merge operations", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		partition.add(2);
		partition.add(3);
		partition.merge(2, 1);
		partition.merge(2, 3);
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		const representative3 = partition.representative(3);
		assert.equal(representative1, representative2);
		assert.equal(representative2, representative3);
		assert.include([1, 2, 3], representative1);
	});
	it("works when merging two values that are already in the same set", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		partition.add(2);
		partition.merge(1, 2);
		partition.merge(1, 2);
		partition.merge(2, 1);

		
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		assert.equal(representative1, representative2);
		assert.isTrue(representative1 === 1 || representative1 === 2);
	});
});
