import { assert } from "chai";
import { describe, it } from "mocha";
import { allNumMultiplications } from "./efficient-exponentiation-2.mjs";

describe("allNumMultiplications", () => {
	it("can return the number of multiplications needed to compute n^15", () => {
		assert.equal(allNumMultiplications(20).get(15), 5);	
	});
	it("can return the number of multiplications needed to compute n^2", () => {
		assert.equal(allNumMultiplications(5).get(2), 1);
	});
	it("can return the number of multiplications needed to compute n^k for 1 <= k <= 5", () => {
		assert.deepEqual(allNumMultiplications(5), new Map([
			[1, 0],
			[2, 1],
			[3, 2],
			[4, 2],
			[5, 3]
		]));
	});
});
