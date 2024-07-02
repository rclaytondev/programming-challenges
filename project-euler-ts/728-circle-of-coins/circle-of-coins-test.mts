import { assert } from "chai";
import { numSolvableStates, solve } from "./circle-of-coins.mjs";
import { describe, it } from "mocha";

describe("numSolvableStates", () => {
	it("returns 4 for 3 coins and 2 flips per move", () => {
		const result = numSolvableStates(3, 2);
		assert.equal(result, 4);
	});
	it("returns 256 for 8 coins and 3 flips per move", () => {
		const result = numSolvableStates(8, 3);
		assert.equal(result, 256);
	});
	it("returns 128 for 9 coins and 3 flips per move", () => {
		const result = numSolvableStates(9, 3);
		assert.equal(result, 128);
	});
});
describe("solve", () => {
	it("returns 22 for an input of 3", () => {
		const result = solve(3);
		assert.equal(result, 22);
	});
	it("returns 10444 for an input of 10", () => {
		const result = solve(10);
		assert.equal(result, 10444);
	});
	it("returns 853837042 for an input of 1000", () => {
		const result = solve(1000);
		assert.equal(result, 853837042);
	});
});
