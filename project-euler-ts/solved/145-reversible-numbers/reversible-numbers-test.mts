import { describe } from "mocha";
import { Problem145 } from "./reversible-numbers.mjs";
import { assert } from "chai";

describe("Problem145.solve", () => {
	it("can find the number of reversible numbers below 1000", () => {
		const result = Problem145.solve(3);
		assert.equal(result, 120);
	});
	it("can find the number of reversible numbers below 10,000", () => {
		const result = Problem145.solve(4);
		assert.equal(result, 720);
	});
});
