import { describe, it } from "mocha";
import { PeriodicSet } from "../PeriodicSet.mjs";
import { assert } from "chai";

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
