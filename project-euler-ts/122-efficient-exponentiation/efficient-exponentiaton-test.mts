import { assert } from "chai";
import { describe, it } from "mocha";
import { numMultiplications } from "./efficient-exponentiation.mjs";

describe("numMultiplications", () => {
	it("can return the number of multiplications needed to compute n^15", () => {
		assert.equal(numMultiplications(15), 5);	
	});
	it("can return the number of multiplications needed to compute n^2", () => {
		assert.equal(numMultiplications(2), 1);
	});
});
