import { describe, it } from "mocha";
import { HashPartition } from "./HashPartition.mjs";
import { assert } from "chai";

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
