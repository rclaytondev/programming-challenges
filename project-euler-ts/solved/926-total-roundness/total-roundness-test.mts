import { describe, it } from "mocha";
import { roundness } from "./total-roundness-2.mjs";
import { factorialRoundness } from "./total-roundness-3.mjs";
import { assert } from "chai";

describe("roundness", () => {
	it("works for 20", () => {
		const result = roundness(20);
		assert.equal(result, 6);
	});
});
describe("factorialRoundness", () => {
	it("works for 10!", () => {
		const result = factorialRoundness(10);
		assert.equal(result, 312);
	});
});
