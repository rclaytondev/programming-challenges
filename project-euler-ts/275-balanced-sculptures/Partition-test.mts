import { describe } from "mocha";
import { Partition } from "./Partition.mjs";
import { assert } from "chai";

describe("Partition", () => {
	it("can add items, merge sets, and get representatives", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		assert.equal(partition.representative(1), 1);
		assert.equal(partition.numSets, 1);
		partition.add(2);
		assert.equal(partition.representative(2), 2);
		assert.equal(partition.numSets, 2);
		partition.merge(1, 2);
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		assert.equal(representative1, representative2);
		assert.isTrue(representative1 === 1 || representative1 === 2);
		assert.equal(partition.numSets, 1);
	});
	it("correctly handles multiple merge operations", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		partition.add(2);
		partition.add(3);
		assert.equal(partition.numSets, 3);
		partition.merge(2, 1);
		partition.merge(2, 3);
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		const representative3 = partition.representative(3);
		assert.equal(representative1, representative2);
		assert.equal(representative2, representative3);
		assert.include([1, 2, 3], representative1);
		assert.equal(partition.numSets, 1);
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
	it("can delete nodes from the partition", () => {
		const partition = Partition.empty<number>();
		partition.add(1);
		partition.add(2);
		partition.add(3);
		partition.merge(1, 2);
		partition.merge(2, 3);
		partition.delete(3);
		
		const representative1 = partition.representative(1);
		const representative2 = partition.representative(2);
		assert.equal(representative1, representative2);
		assert.isTrue(representative1 === 1 || representative1 === 2);
	});
});
describe("Partition.fromSets", () => {
	it("correctly constructs the partition from a set of sets", () => {
		const partition = Partition.fromSets([[1], [2, 3], [4]]);
		assert.equal(partition.representative(1), 1);
		assert.equal(partition.representative(2), partition.representative(3));
		assert.equal(partition.representative(4), 4);
	});
});
describe("Partition.sets", () => {
	it("can return all the sets in the partition", () => {
		const partition = Partition.fromSets([[1], [2, 3], [4]]);
		assert.sameDeepMembers(partition.sets, [
			new Set([1]),
			new Set([2, 3]),
			new Set([4]),
		]);
	});
});
describe("Partition.copy", () => {
	it("returns a new partition consisting of the same sets", () => {
		const partition = Partition.fromSets([[1], [2, 3], [4]]);
		const copy = partition.copy();
		assert.sameDeepMembers(copy.sets, [
			new Set([1]),
			new Set([2, 3]),
			new Set([4]),
		]);
	});
});
describe("Partition.map", () => {
	it("constructs a new Partition by calling the callback on each value", () => {
		const partition = Partition.fromSets<string>([["a"], ["b", "c"], ["d"]]);
		const mapped = partition.map(s => s.toUpperCase());
		assert.sameDeepMembers(mapped.sets, [
			new Set(["A"]),
			new Set(["B", "C"]),
			new Set(["D"])
		]);
	});
	it("merges some sets in the partition if the callback is not injective", () => {
		const partition = Partition.fromSets<number>([[3, 4], [5], [6]]);
		const mapped = partition.map(n => n % 2);
		assert.sameDeepMembers(mapped.sets, [
			new Set([0, 1]),
		]);
	});
});
