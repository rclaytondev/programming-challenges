import { assert } from "chai";
import { constructNumber, primeSumMaxDigits, solve } from "./primes-with-runs.mjs";
import { describe, it } from "mocha";

describe("primeSumMaxDigits", () => {
	it("can return the sum of the 4-digit primes with as many 0's as possible", () => {
		const result = primeSumMaxDigits(4, 0);
		assert.equal(result, 67061);
	});
});
describe("constructNumber", () => {
	it("returns the number that has the given digit at the other positions, and the other digits in order in the other positions", () => {
		const num = constructNumber(1, new Set([0, 3, 5]), [2, 3, 4, 5, 6]);
		assert.equal(num, 12314156);
	});
});
describe("solve", () => {
	it("correctly solves the problem for 4-digit primes", () => {
		const expected = 67061 + 22275 + 2221 + 46214 + 8888 + 5557 + 6661 + 57863 + 8887 + 48073;
		const actual = solve(4);
		assert.equal(actual, expected);
	});
});
