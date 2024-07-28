import { assert } from "chai";
import { describe } from "mocha";
import { solve } from "./divisible-ranges-3.mjs";

describe("solve", () => {
	it("returns 2 when given 2", () => {
		assert.equal(solve(2), 2);
	});
	it("returns 5 when given 5", () => {
		assert.equal(solve(5), 5);
	});
	it("returns 420 when given 10", () => {
		assert.equal(solve(10), 420);
	});
});
