import { describe } from "mocha";
import { Problem112 } from "./bouncy-numbers.mjs";
import { assert } from "chai";

describe("Problem112.solve", () => {
	it("can find the smallest number for which the proportion of bouncy numbers is 90%", () => {
		const result = Problem112.solve(0.9);
		assert.equal(result, 21780);
	});
});
