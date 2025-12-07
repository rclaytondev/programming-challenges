import { describe, it } from "mocha";
import { numWithStreaks } from "./divisibility-streaks.mjs";
import { assert } from "chai";
import { PeriodicSet } from "../896-divisible-ranges/divisible-ranges-3.mjs";

describe("numWithStreaks", () => {
	it("works for the first example from Project Euler", () => {
		const result = numWithStreaks(3, 14);
		assert.equal(result, 1);
	});
	it("works for the second example from Project Euler", () => {
		const result = numWithStreaks(6, 10 ** 6);
		assert.equal(result, 14286);
	});
});

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
