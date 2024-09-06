import { describe, it } from "mocha";
import { leastWithDivisors, naiveSolution } from "./divisors.mjs";
import { assert } from "chai";

describe("leastWithDivisors", () => {
	it("returns the same result as the naive algorithm for 4", () => {
		const expected = naiveSolution(4);
		const actual = leastWithDivisors(4);
		assert.equal(actual, expected);
	});
	it("returns the same result as the naive algorithm for 5", () => {
		const expected = naiveSolution(5);
		const actual = leastWithDivisors(5);
		assert.equal(actual, expected);
	});
});
