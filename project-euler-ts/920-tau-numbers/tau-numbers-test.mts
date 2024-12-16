import { assert } from "chai";
import { describe } from "mocha";
import { TauNumbers } from "./tau-numbers.mjs";

describe("TauNumbers.productPartitions", () => {
	it("can return all the ways of writing the number as a product of integers greater than 1 in decreasing order", () => {
		const partitions = TauNumbers.productPartitions(12);
		assert.sameDeepMembers(partitions, [
			[12],
			[6, 2],
			[4, 3],
			[3, 2, 2]
		]);
	});
});

describe("TauNumbers.minTauNumber", () => {
	it("returns 24 when given 8", () => {
		assert.equal(TauNumbers.minTauNumber(8), 24);
	});
	it("returns 60 when given 12", () => {
		assert.equal(TauNumbers.minTauNumber(12), 60);
	});
	it("returns 384 when given 16", () => {
		assert.equal(TauNumbers.minTauNumber(16), 384);
	});
});

describe("TauNumbers.tauSum", () => {
	it("returns 3189 for an input of 1000", () => {
		assert.equal(TauNumbers.tauSum(1000), 3189);
	});
});
