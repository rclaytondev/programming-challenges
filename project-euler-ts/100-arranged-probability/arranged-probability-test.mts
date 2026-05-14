import { describe } from "mocha";
import { nextSolution } from "./arranged-probability.mjs";
import { assert } from "chai";

describe("nextSolution", () => {
	it("works for 20", () => {
		const result = nextSolution(20n);
		assert.equal(result, 15n);
	});
	it("works for 21", () => {
		const result = nextSolution(21n);
		assert.equal(result, 85n);
	});
});
