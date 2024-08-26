import { assert } from "chai";
import { describe, it } from "mocha";
import { multiplesInRange, Range, termsInTable } from "./multiplication-table.mjs";

describe("multiplesInRange", () => {
	it("returns the number of numbers in the range that are divisible by at least one item in the divisors list", () => {
		assert.equal(multiplesInRange([2n, 3n], new Range(1n, 20n)), 13n);
	});
	it("works when there is one number in the divisors list", () => {
		assert.equal(multiplesInRange([3n], new Range(31n, 32n)), 0n);
		assert.equal(multiplesInRange([3n], new Range(30n, 32n)), 1n);
		assert.equal(multiplesInRange([3n], new Range(31n, 33n)), 1n);
		assert.equal(multiplesInRange([3n], new Range(30n, 33n)), 2n);
	});
	it("returns the number of numbers in the range when 1 is in the divisors list", () => {
		assert.equal(multiplesInRange([1n, 2n], new Range(2n, 5n)), 4n);
	});
});
describe("termsInTable", () => {
	it("works for the input of (3, 4) from Project Euler", () => {
		assert.equal(termsInTable(3n, 4n), 8n);
	});
	it("works for the input of (64, 64) from Project Euler", () => {
		assert.equal(termsInTable(64n, 64n), 1263n);
	});
	it("works for the input of (12, 345) from Project Euler", () => {
		assert.equal(termsInTable(12n, 345n), 1998n);
	});
	// it("works for the input of (32, 10^15) from Project Euler", () => {
	// 	assert.equal(termsInTable(32n, 10n ** 15n), 13826382602124302n);
	// });
});
