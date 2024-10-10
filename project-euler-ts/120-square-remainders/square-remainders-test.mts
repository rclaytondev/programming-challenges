import { describe, it } from "mocha";
import { assert } from "chai";
import { maxSquareRemainder } from "./square-remainders.mjs";
describe("maxSquareRemainder", () => {
	it("works for the example from Project Euler", () => {
		const result = maxSquareRemainder(7);
		assert.equal(result, 42);
	});
});
