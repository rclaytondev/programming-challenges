import { describe } from "mocha";
import { numPartitions } from "./coin-partitions-2.mjs";
import { assert } from "chai";

describe("numPartitions", () => {
	it("can correctly calculate the number of partitions of 2", () => {
		const result = numPartitions(2);
		assert.equal(result, 2); // 2 and 1+1
	});
	it("can correctly calculate the number of partitions of 3", () => {
		const result = numPartitions(3);
		assert.equal(result, 3); // 3, 1+2, 1+1+1
	});
	it("can correctly calculate the number of partitions of 5", () => {
		const result = numPartitions(5);
		assert.equal(result, 7);
	});
});
