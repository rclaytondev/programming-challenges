import { describe, it } from "mocha";
import { PeriodicSet } from "../PeriodicSet.mjs";
import { assert } from "chai";
import { ArrayUtils } from "../../../utils-ts/modules/core-extensions/ArrayUtils.mjs";

describe("PeriodicSet.numTermsBelow", () => {
	const EVENS = new PeriodicSet(2, [0]);
	const ODDS = new PeriodicSet(2, [1]);
	it("can return the number of even integers between 1 and 9, inclusive", () => {
		const result = EVENS.numTermsBelow(9);
		assert.equal(result, 4); // 2, 4, 6, 8
	});
	it("can return the number of even integers between 1 and 10, inclusive", () => {
		const result = EVENS.numTermsBelow(10);
		assert.equal(result, 5); // 2, 4, 6, 8, 10
	});
	it("can return the number of odd integers between 1 and 9, inclusive", () => {
		const result = ODDS.numTermsBelow(9);
		assert.equal(result, 5); // 1, 3, 5, 7, 9
	});
	it("can return the number of odd integers between 1 and 10, inclusive", () => {
		const result = ODDS.numTermsBelow(10);
		assert.equal(result, 5); // 1, 3, 5, 7, 9
	});
});
describe("PeriodicSet.intersection", () => {
	it("correctly computes the set of numbers that are in both sets", () => {
		const set1 = new PeriodicSet(5, [1, 3]);
		const set2 = new PeriodicSet(7, [2, 5]);
		const actual = set1.intersection(set2);
		const expected = ArrayUtils.range(1, 35).filter(
			n => [1, 3].includes(n % 5) && [2, 5].includes(n % 7)
		); // 16, 23, 26, 33
		assert.deepEqual(actual, new PeriodicSet(35, expected));
	});
	it("works when the periods are not coprime", () => {
		const set1 = new PeriodicSet(6, [3, 5]);
		const set2 = new PeriodicSet(10, [0, 1]);
		const actual = set1.intersection(set2);
		const expected = new PeriodicSet(30, [11, 21]);
		assert.deepEqual(actual, expected);
	});
});
