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
