import { describe, it } from "mocha";
import { HashPartition } from "./HashPartition.mjs";
import { assert } from "chai";
import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";

describe("HashPartition", () => {
	it("can add items, merge sets, and get representatives, using non-referential equality provided by the hash function", () => {
		const partition = HashPartition.empty<[number, number]>();
		partition.add([1, 2]);
		assert.deepEqual(partition.representative([1, 2]), [1, 2]);
		partition.add([3, 4]);
		assert.deepEqual(partition.representative([3, 4]), [3, 4]);
		partition.merge([1, 2], [3, 4]);
		const representative1 = partition.representative([1, 2]);
		const representative2 = partition.representative([3, 4]);
		assert.equal(representative1, representative2);
	});
});
describe("HashPartition.fromSets", () => {
	it("correctly constructs the partition from a set of sets", () => {
		const partition = HashPartition.fromSets([[1], [2, 3], [4]]);
		assert.equal(partition.representative(1), 1);
		assert.equal(partition.representative(2), partition.representative(3));
		assert.equal(partition.representative(4), 4);
	});
});
describe("HashPartition.map", () => {
	it("constructs a new HashPartition by calling the callback on each value", () => {
		const partition = HashPartition.fromSets<{ x: string }>([
			[{ x: "a" }], [{ x: "b" }, { x: "c" }], [{ x: "d" }]
		], ({ x }) => `${x}`);
		const mapped = partition.map(
			({ x }) => ({ x: x.toUpperCase() }),
			({ x }) => `${x}`
		);
		const mappedSets = [...mapped.sets()].map(s => [...s]);
		const equals = (obj1: { x: string }, obj2: { x: string }) => obj1.x === obj2.x;
		assert.equal(mappedSets.length, 3);
		assert.isTrue(mappedSets.some(arr => ArrayUtils.equals(arr, [{ x: "A" }], equals)));
		assert.isTrue(mappedSets.some(arr => 
			ArrayUtils.equals(arr, [{ x: "B" }, { x: "C" }], equals)
			|| ArrayUtils.equals(arr, [{ x: "C" }, { x: "B" }], equals)
		));
		assert.isTrue(mappedSets.some(arr => ArrayUtils.equals(arr, [{ x: "D" }], equals)));
	});
	it("merges some sets in the partition if the callback is not injective", () => {
		const partition = HashPartition.fromSets<{ x: number }>([
			[{ x: 3 }, { x: 4 }], [{ x: 5 }], [{ x: 6 }]
		], ({ x }) => `${x}`);
		const mapped = partition.map(
			({ x }) => ({ x: x % 2 }),
			({ x }) => `${x}`
		);
		assert.sameDeepMembers([...mapped.sets()].map(s => [...s]), [
			[{ x: 0 }, { x: 1 }]
		]);
	});
});
