import { assert } from "chai";
import { describe } from "mocha";
import { MultiplesIterator, TauNumbers } from "./tau-numbers.mjs";

describe("MultiplesIterator", () => {
	it("can iterate over all multiples of a set of numbers in a range, with deletion of multiples along the way", () => {
		const iterator = new MultiplesIterator([2, 3]);
		const results = [];
		while(iterator.current <= 20) {
			results.push(iterator.current);
			iterator.step();
			if(iterator.current === 10) {
				iterator.multipliers.delete(3);
			}
		}
		assert.sameOrderedMembers(results, [
			2, 3, 4, 6, 8, 9, 10, // multiples of 2 or 3 below 10
			12, 14, 16, 18, 20 // remaining multiples of 2 below 20
		]);
	});
	it("works when the next multiple of the deleted number should not be visited", () => {
		const iterator = new MultiplesIterator([2, 3]);
		const results = [];
		while(iterator.current <= 20) {
			results.push(iterator.current);
			iterator.step();
			if(iterator.current === 12) {
				iterator.multipliers.delete(3);
			}
		}
		assert.sameOrderedMembers(results, [
			2, 3, 4, 6, 8, 9, 10, 12, // multiples of 2 or 3 below 12
			14, 16, 18, 20 // remaining multiples of 2 below 20
		]);
	});
});

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
		assert.equal(TauNumbers.minTauNumber(8, 1000), 24);
	});
	it("returns 60 when given 12", () => {
		assert.equal(TauNumbers.minTauNumber(12, 1000), 60);
	});
	it("returns 384 when given 16", () => {
		assert.equal(TauNumbers.minTauNumber(16, 1000), 384);
	});
});

describe("TauNumbers.tauSum", () => {
	it("returns 3189 for an input of 1000", () => {
		assert.equal(TauNumbers.tauSum(1000), 3189);
	});
});
